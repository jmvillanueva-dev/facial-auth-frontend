import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TbCamera, TbCheck, TbX, TbLogin2 } from "react-icons/tb";
import { PiUserFocus } from "react-icons/pi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Estilos para el modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90vw",
    width: "500px",
    borderRadius: "12px",
    padding: "2rem",
    zIndex: 15, 
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 14,
  },
};

Modal.setAppElement("#root");

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [imageQuality, setImageQuality] = useState({
    hasGoodLighting: false,
    isCentered: false,
    isClear: false,
  });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  // Efecto para manejar la cámara
  useEffect(() => {
    if (cameraModalOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [cameraModalOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("No se pudo acceder a la cámara");
      console.error("Error al acceder a la cámara:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      // Simulamos chequeo de calidad de imagen (en un caso real usarías una librería o API)
      const qualityCheck = {
        hasGoodLighting: Math.random() > 0.3, // 70% de probabilidad de buena luz
        isCentered: Math.random() > 0.3, // 70% de probabilidad de estar centrado
        isClear: Math.random() > 0.3, // 70% de probabilidad de estar claro
      };

      setImageQuality(qualityCheck);

      // Si cumple con los requisitos, permitimos usar la foto
      if (
        qualityCheck.hasGoodLighting &&
        qualityCheck.isCentered &&
        qualityCheck.isClear
      ) {
        canvas.toBlob(
          (blob) => {
            const file = new File([blob], "face.jpg", { type: "image/jpeg" });
            setValue("face_image", [file]);
            toast.success("Foto capturada con éxito");
          },
          "image/jpeg",
          0.95
        );
      } else {
        toast.warning("La foto no cumple con los requisitos de calidad");
      }
    }
  };

  const handleRegister = async (data) => {
    const formData = new FormData();
    formData.append("username", data.email.split("@")[0]);
    formData.append("full_name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("password2", data.confirmPassword);
    formData.append("face_image", data.face_image[0]);

    try {
      const res = await axios.post(`${API_URL}/api/auth/register/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { access } = res.data.tokens;
      localStorage.setItem("token", access);
      toast.success("Registro exitoso 🎉");
      reset();
      setIsLogin(true);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {})[0] ||
        "Error de registro";
      toast.error(msg.toString());
    }
  };

  const handleLogin = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login/`, {
        username: data.email.split("@")[0],
        password: data.password,
      });
      const { access } = res.data.tokens;
      localStorage.setItem("token", access);
      toast.success("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Credenciales incorrectas");
      console.error("Error de inicio de sesión:", err);
    }
  };

  const handleFaceLogin = async () => {
    try {
      setIsCameraActive(true);
      setIsProcessing(true);
      toast.info("Preparando cámara...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      toast.info("Por favor, mire a la cámara");

      // Esperamos 2 segundos para dar tiempo al usuario a posicionarse
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      stream.getTracks().forEach((t) => t.stop());

      const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg"));
      const faceFile = new File([blob], "face.jpg", { type: "image/jpeg" });

      toast.info("Verificando tu identidad...");

      const formData = new FormData();
      formData.append("face_image", faceFile);

      const res = await axios.post(
        `${API_URL}/api/auth/login/face/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      localStorage.setItem("token", res.data.tokens.access);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(`Bienvenido ${res.data.user.full_name}!`);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.detail || "No se reconoció el rostro");
    } finally {
      setIsCameraActive(false);
      setIsProcessing(false);
    }
  };

  const onSubmit = (data) => {
    if (isLogin) handleLogin(data);
    else handleRegister(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      {/* Botón para volver al Home */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver al inicio
      </button>

      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Botón de FaceAuth */}
          {isLogin && (
            <button
              type="button"
              onClick={handleFaceLogin}
              disabled={isProcessing || isCameraActive}
              className={`flex items-center justify-center w-full py-2 rounded-md mb-3 font-medium transition-colors  ${
                isProcessing || isCameraActive
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-cyan-100 hover:bg-cyan-200 text-indigo-600"
              }`}
            >
              {isCameraActive ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Reconociendo rostro...
                </span>
              ) : (
                <>
                  <PiUserFocus className="mr-2" /> Iniciar sesión con FaceAuth
                </>
              )}
            </button>
          )}

          {isLogin && (
            <div className="flex items-center justify-center my-2">
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="mx-4 text-gray-400">o</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
          )}

          {/* full_name */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                })}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          {/* email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo inválido",
                },
              })}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirma tu contraseña",
                    validate: (value, { password }) =>
                      value === password || "Las contraseñas no coinciden",
                  })}
                  className={`w-full px-4 py-2 border rounded-md ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Campo de foto de rostro */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto de rostro
              </label>
              <button
                type="button"
                onClick={() => setCameraModalOpen(true)}
                className="w-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-md border border-blue-200 transition duration-150"
              >
                <TbCamera className="mr-2" />
                {watch("face_image") ? "Foto capturada" : "Tomar foto"}
              </button>
              {errors.face_image && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.face_image.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </span>
            ) : isLogin ? (
              "Ingresar"
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>

      {/* Modal para captura de foto en registro */}
      <Modal
        isOpen={cameraModalOpen}
        onRequestClose={() => setCameraModalOpen(false)}
        style={customStyles}
        contentLabel="Captura de rostro"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-center">Captura tu rostro</h3>

          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Requisitos de la foto:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center">
                {imageQuality.hasGoodLighting ? (
                  <TbCheck className="text-green-500 mr-2" />
                ) : (
                  <TbX className="text-red-500 mr-2" />
                )}
                Buena iluminación
              </li>
              <li className="flex items-center">
                {imageQuality.isCentered ? (
                  <TbCheck className="text-green-500 mr-2" />
                ) : (
                  <TbX className="text-red-500 mr-2" />
                )}
                Rostro centrado
              </li>
              <li className="flex items-center">
                {imageQuality.isClear ? (
                  <TbCheck className="text-green-500 mr-2" />
                ) : (
                  <TbX className="text-red-500 mr-2" />
                )}
                Imagen clara
              </li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={capturePhoto}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
            >
              Tomar foto
            </button>
            <button
              onClick={() => setCameraModalOpen(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Auth;
