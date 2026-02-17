import { useState, useRef, useEffect } from "react";
import { Upload, FileText } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { ChatInput } from "./components/ChatInput";
import { ChatMessage } from "./components/ChatMessage";
import apiClient from "./api/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatLoading]);

  // Vérifier si des documents existent déjà au chargement
  useEffect(() => {
    const checkDocuments = async () => {
      try {
        const response = await apiClient.get("/api/documents/count");
        if (response.data.count > 0) {
          setUploadStatus("success");
          toast.success("Documents existants détectés. Discussion activée !");
        }
      } catch (error) {
        console.error("Erreur vérification documents:", error);
      }
    };
    checkDocuments();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // setUploadStatus("idle"); // Ne pas remettre à idle si on veut laisser le chat visible ?
      // Si on upload un nouveau fichier, on veut peut-être réinitialiser ?
      // Pour l'instant on garde le comportement : sélection = reset status visuel (mais pas delete DB)
      setUploadStatus("idle");
      setMessages([]); // Reset chat on new file
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus("uploading");
    const loadingToast = toast.loading("Analyse du document en cours...");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      // Axios détecte automatiquement le Content-Type multipart/form-data
      await apiClient.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadStatus("success");
      toast.success("Document analysé avec succès !", { id: loadingToast });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      toast.error("Échec de l'upload. Veuillez réessayer.", {
        id: loadingToast,
      });
    }
  };

  const handleChat = async (userQuestion: string) => {
    // Add user message immediately
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userQuestion },
    ];
    setMessages(newMessages);
    setIsChatLoading(true);

    try {
      const response = await apiClient.post("/api/chat", {
        question: userQuestion,
      });

      // Add assistant response
      setMessages([
        ...newMessages,
        { role: "assistant", content: response.data.answer },
      ]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const message = error.response?.data?.error || "Une erreur est survenue.";
      toast.error(message);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 font-sans">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DocuChat
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discutez avec vos documents PDF grâce à l'IA
          </p>
        </header>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all hover:shadow-2xl">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="w-full max-w-md">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Cliquez pour upload</span>{" "}
                    ou glissez-déposez
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF (MAX. 10MB)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {file && (
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
                <FileText className="w-4 h-4" />
                {file.name}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploadStatus === "uploading"}
              className={`
                px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95
                ${
                  !file || uploadStatus === "uploading"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                }
              `}
            >
              {uploadStatus === "uploading" ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Traitement en
                  cours...
                </span>
              ) : (
                "Analyser le document"
              )}
            </button>
          </div>
        </div>

        {/* Chat Section */}
        {uploadStatus === "success" && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-[600px]">
            <h2 className="text-2xl font-bold text-center mb-4">Discussion</h2>

            {/* Messages List Area - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-6 px-4 py-2 custom-scrollbar">
              {messages.length === 0 && (
                <p className="text-center text-gray-500 mt-10">
                  Posez votre première question pour démarrer la discussion.
                </p>
              )}

              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  role={msg.role}
                  content={msg.content}
                />
              ))}

              {isChatLoading && (
                <div className="flex justify-center py-4">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <ChatInput onSend={handleChat} disabled={isChatLoading} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
