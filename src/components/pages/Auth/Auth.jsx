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
  const [hasValidPhoto, setHasValidPhoto] = useState(false); // State to track if a valid photo has been taken
  const [imageQuality, setImageQuality] = useState({
    hasGoodLighting: false,
    isCentered: false,
    isClear: false,
  });
  const [showForceRegisterOption, setShowForceRegisterOption] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Estados para manejar coincidencias ambiguas y feedback
  const [ambiguousMatches, setAmbiguousMatches] = useState([]);
  const [ambiguousModalOpen, setAmbiguousModalOpen] = useState(false);
  const [selectedAmbiguousUser, setSelectedAmbiguousUser] = useState(null);
  const [capturedFaceFile, setCapturedFaceFile] = useState(null);
  const [feedbackPassword, setFeedbackPassword] = useState("");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [confirmedUser, setConfirmedUser] = useState(null);
  const [loginAttemptId, setLoginAttemptId] = useState(null);
  const [currentModalStep, setCurrentModalStep] = useState("initial_prompt");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      force_register: false,
    },
  });

  const faceImage = watch("face_image");
  // Effect to update hasValidPhoto based on faceImage presence
  useEffect(() => {
    if (!faceImage || faceImage.length === 0) {
      setHasValidPhoto(false);
      setImageQuality({
        hasGoodLighting: false,
        isCentered: false,
        isClear: false,
      });
    } else {
      // If faceImage exists, assume it's valid for now, until quality check is done
      // The capturePhoto function already sets hasValidPhoto to true on success
      setHasValidPhoto(true);
    }
  }, [faceImage]);

  useEffect(() => {
    if (cameraModalOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [cameraModalOpen]);

  useEffect(() => {
    setShowForceRegisterOption(false);
    setValue("force_register", false);
  }, [isLogin, setValue]);

  const startCamera = async () => {
    try {
      stopCamera(); // Ensure any existing camera stream is stopped

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });
        videoRef.current.play();
      }
    } catch (err) {
      toast.error("No se pudo acceder a la cámara");
      console.error("Error al acceder a la cámara:", err);
      setCameraModalOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Simulate quality checks for demonstration purposes
      // In a real application, you would use a facial detection library
      const qualityCheck = {
        hasGoodLighting: Math.random() > 0.1, // 90% chance of good lighting
        isCentered: Math.random() > 0.1, // 90% chance of being centered
        isClear: Math.random() > 0.1, // 90% chance of being clear
      };

      setImageQuality(qualityCheck);

      if (
        qualityCheck.hasGoodLighting &&
        qualityCheck.isCentered &&
        qualityCheck.isClear
      ) {
        canvas.toBlob(
          (blob) => {
            const file = new File([blob], "face.jpg", { type: "image/jpeg" });
            setValue("face_image", [file]); // Set the file in react-hook-form
            setHasValidPhoto(true); // Mark photo as valid
            toast.success("Foto capturada con éxito");
          },
          "image/jpeg",
          0.95
        );
      } else {
        toast.warning(
          "La foto no cumple con los requisitos de calidad. Intenta de nuevo."
        );
        setHasValidPhoto(false); // Mark photo as invalid
        setValue("face_image", null); // Clear the photo from the form
      }
    }
  };

  const handleRegister = async (data) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("full_name", data.name);
    formData.append("password", data.password);
    formData.append("password_conf", data.confirmPassword);
    // Ensure face_image is appended only if it exists
    if (data.face_image && data.face_image.length > 0) {
      formData.append("face_image", data.face_image[0]);
    }
    formData.append("force_register", data.force_register ? "true" : "false");

    try {
      const res = await axios.post(`${API_URL}/api/auth/register/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Registro exitoso 🎉");
      const { access } = res.data.tokens;
      localStorage.setItem("token", access);
      reset();
      setIsLogin(true);
      setShowForceRegisterOption(false);
      setValue("force_register", false);
      setHasValidPhoto(false); // Reset photo state after successful registration
    } catch (err) {
      if (err.response) {
        const { data } = err.response;
        const cleanErrorMessage = (error) => {
          return String(error)
            .replace(/^\[|\]$/g, "")
            .replace(/^'|'$/g, "");
        };

        let errorMessage = "Ocurrió un error desconocido durante el registro.";

        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((message) => {
                toast.error(cleanErrorMessage(message));
              });
            } else {
              toast.error(cleanErrorMessage(messages));
            }
          });
          errorMessage = Object.values(data.errors)
            .flat()
            .map(cleanErrorMessage)
            .join(", ");
        } else if (data.detail || data.message) {
          errorMessage = cleanErrorMessage(data.detail || data.message);
          toast.error(errorMessage);
        } else {
          errorMessage = JSON.stringify(data);
          toast.error("Error inesperado en la respuesta del servidor.");
        }

        console.error("Mensaje de error del backend:", errorMessage);

        if (errorMessage.includes("Este rostro ya está registrado")) {
          setShowForceRegisterOption(true);
        } else {
          setShowForceRegisterOption(false);
          setValue("force_register", false);
        }
      } else {
        toast.error("Error de red o servidor no disponible.");
        console.error("Error de red:", err);
        setShowForceRegisterOption(false);
        setValue("force_register", false);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogin = async (data) => {
    setIsProcessing(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login/`, {
        username: data.email.split("@")[0],
        password: data.password,
      });
      const { access } = res.data.tokens;
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(`Bienvenido ${res.data.user.full_name}!`);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      toast.error("Credenciales incorrectas");
      console.error("Error de inicio de sesión:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para manejar el inicio de sesión con reconocimiento facial
  const handleFaceLogin = async () => {
    setIsCameraActive(true);
    setIsProcessing(true);
    toast.info("Preparando cámara...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      toast.info("Por favor, mire a la cámara");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      stream.getTracks().forEach((t) => t.stop());

      const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg"));
      const faceFile = new File([blob], "face.jpg", { type: "image/jpeg" });
      setCapturedFaceFile(faceFile);

      toast.info("Verificando tu identidad...");

      const formData = new FormData();
      formData.append("face_image", faceFile);

      const res = await axios.post(
        `${API_URL}/api/auth/login/face/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setLoginAttemptId(res.data.login_attempt_id);

      if (res.data.status === "success") {
        setConfirmedUser(res.data.user);
        setIsFeedbackModalOpen(true);
        setCurrentModalStep("initial_prompt");
      } else if (res.data.status === "ambiguous_match") {
        setAmbiguousMatches(res.data.matches);
        setAmbiguousModalOpen(true);
        setCurrentModalStep("ambiguous_selection");
        toast.warning(
          "Coincidencia ambigua. Por favor, confirma tu identidad."
        );
      } else {
        toast.error("No se encontró una coincidencia con tu rostro.");
        if (res.data.login_attempt_id) {
          handleFeedbackSubmit(
            "incorrecto",
            null,
            null,
            res.data.login_attempt_id
          );
        }
      }
    } catch (err) {
      if (err.response && err.response.data.detail) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Ocurrió un error durante el reconocimiento facial.");
      }
      console.error("Error en el reconocimiento facial:", err);
      if (loginAttemptId) {
        handleFeedbackSubmit("incorrecto", null, null, loginAttemptId);
      }
    } finally {
      setIsCameraActive(false);
      setIsProcessing(false);
    }
  };

  // Función para manejar el envío de feedback
  const handleFeedbackSubmit = async (
    feedback_decision,
    user = null,
    password = ""
  ) => {
    setIsProcessing(true);
    const formData = new FormData();

    if (loginAttemptId) {
      formData.append("login_attempt_id", loginAttemptId);
    }
    formData.append("feedback_decision", feedback_decision);

    if (feedback_decision === "correcto") {
      if (user) formData.append("user_id", user.id);
      if (password) formData.append("password", password);
      if (capturedFaceFile) formData.append("face_image", capturedFaceFile);
    } else {
      if (capturedFaceFile) formData.append("face_image", capturedFaceFile);
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login/face/feedback/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (feedback_decision === "correcto") {
        localStorage.setItem("token", res.data.tokens.access);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success(
          `Bienvenido ${res.data.user.full_name}! Gracias por tu feedback.`
        );
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast.info("Feedback de identificación incorrecta registrado.");
      }
      closeAllModalsAndResetState();
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          "Error al procesar el feedback. Contraseña incorrecta o datos inválidos."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = (data) => {
    if (isLogin) handleLogin(data);
    else handleRegister(data);
  };

  // Función para cerrar todos los modales y resetear el estado
  const closeAllModalsAndResetState = () => {
    setAmbiguousModalOpen(false);
    setIsFeedbackModalOpen(false);
    setFeedbackPassword("");
    setSelectedAmbiguousUser(null);
    setConfirmedUser(null);
    setCapturedFaceFile(null);
    setLoginAttemptId(null);
    setCurrentModalStep("initial_prompt");
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
              className={`flex items-center justify-center w-full py-2 rounded-md mb-3 font-medium transition-colors ${
                isProcessing || isCameraActive
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-cyan-100 hover:bg-cyan-200 text-indigo-600"
              }`}
            >
              {isProcessing || isCameraActive ? (
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
            <div className="flex items-center justify-between text-center mb-4 font-light text-xs text-gray-600">
              <span>
                Servicio en Beta: ayúdanos a mejorar enviando tu feedback tras
                cada reconocimiento.
              </span>
            </div>
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

          {/* Opción de Forzar Registro (condicional) */}
          {!isLogin && showForceRegisterOption && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <p className="text-sm text-red-700 font-medium mb-2">
                ¡Atención! Se detectó un rostro similar a uno ya registrado.
              </p>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="force-register-checkbox"
                  {...register("force_register")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="force-register-checkbox"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Estoy seguro de que soy una persona nueva o deseo actualizar
                  mi perfil.
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            // Modified disabled prop:
            // If it's a login form, disable only if processing.
            // If it's a registration form, disable if processing OR if no valid photo has been taken.
            disabled={isProcessing || (!isLogin && !hasValidPhoto)}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150
              ${
                isProcessing || (!isLogin && !hasValidPhoto)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
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
        onRequestClose={() => {
          stopCamera();
          setCameraModalOpen(false);
          setHasValidPhoto(false); // Ensure photo state is reset on modal close
          setValue("face_image", null); // Clear the photo from the form
        }}
        style={customStyles}
        contentLabel="Captura de rostro"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-center">
            {hasValidPhoto ? "Foto capturada" : "Captura tu rostro"}
          </h3>

          <div className="relative bg-black rounded-lg overflow-hidden">
            {hasValidPhoto ? (
              <img
                src={canvasRef.current?.toDataURL()}
                alt="Foto capturada"
                className="w-full h-auto -scale-x-100"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto -scale-x-100"
              />
            )}
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
            {hasValidPhoto ? (
              <>
                <button
                  onClick={() => {
                    stopCamera();
                    setCameraModalOpen(false);
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                >
                  Usar esta foto
                </button>
                <button
                  onClick={() => {
                    setHasValidPhoto(false);
                    setValue("face_image", null);
                    startCamera();
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md"
                >
                  Volver a tomar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                >
                  Tomar foto
                </button>
                <button
                  onClick={() => {
                    setCameraModalOpen(false);
                    setValue("face_image", null);
                    setHasValidPhoto(false); // Ensure photo state is reset on cancel
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* --- Modal para confirmar identidad después de un match exitoso o ambiguo --- */}
      <Modal
        isOpen={isFeedbackModalOpen || ambiguousModalOpen}
        onRequestClose={closeAllModalsAndResetState}
        style={customStyles}
        contentLabel="Confirma tu identidad"
      >
        {/* Sección inicial de pregunta "¿Es usted?" para status 'success' */}
        {currentModalStep === "initial_prompt" && confirmedUser && (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-center">
              Rostro reconocido
            </h3>
            <p className="text-center text-sm text-gray-600">
              Hemos reconocido tu rostro como:
            </p>
            <p className="text-center font-semibold text-lg text-indigo-600">
              Perfil: {confirmedUser.full_name}
            </p>
            <p className="text-center text-gray-600">¿Es usted este perfil?</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setCurrentModalStep("password_input")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-150"
              >
                Sí, soy yo
              </button>
              <button
                onClick={() =>
                  handleFeedbackSubmit("incorrecto", confirmedUser, "")
                }
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md transition duration-150"
              >
                No soy yo
              </button>
            </div>
          </div>
        )}

        {/* Sección de selección de coincidencias ambiguas */}
        {currentModalStep === "ambiguous_selection" &&
          ambiguousMatches.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-center mb-4">
                ¿Cuál de estos perfiles eres tú?
              </h3>
              <p className="text-center text-sm text-gray-600 mb-6">
                El sistema encontró múltiples perfiles con similitud. Por favor,
                selecciona el tuyo para ayudarnos a mejorar.
              </p>

              <ul className="mb-6 space-y-3">
                {ambiguousMatches.map((match) => (
                  <li key={match.id}>
                    <button
                      onClick={() => {
                        setSelectedAmbiguousUser(match);
                        setCurrentModalStep("password_input"); // Ir al paso de contraseña
                      }}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                        selectedAmbiguousUser?.id === match.id
                          ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      <span className="font-semibold">{match.full_name}</span>
                      <br />
                      <span className="text-xs opacity-75">
                        ID de usuario: {match.id}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleFeedbackSubmit("incorrecto", null, "")}
                className="w-full text-center text-sm text-red-600 hover:text-red-800 transition duration-150"
              >
                Ninguno corresponde a mi perfil
              </button>
            </div>
          )}

        {/* Sección de entrada de contraseña para confirmación */}
        {currentModalStep === "password_input" &&
          (confirmedUser || selectedAmbiguousUser) && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-center">
                Confirmar Identidad
              </h3>
              <p className="text-center text-sm text-gray-600">
                Para completar el inicio de sesión y mejorar la precisión de
                nuestro modelo, por favor, ingresa tu contraseña.
              </p>
              <p className="text-center font-semibold text-lg text-indigo-600">
                Perfil:{" "}
                {confirmedUser?.full_name || selectedAmbiguousUser?.full_name}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const userToConfirm = confirmedUser || selectedAmbiguousUser;
                  if (userToConfirm) {
                    handleFeedbackSubmit(
                      "correcto",
                      userToConfirm,
                      feedbackPassword
                    );
                  }
                }}
              >
                <div>
                  <label
                    htmlFor="feedback-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="feedback-password"
                    value={feedbackPassword}
                    onChange={(e) => setFeedbackPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeAllModalsAndResetState}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md text-gray-800 transition duration-150"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-150 ${
                      isProcessing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isProcessing ? "Verificando..." : "Confirmar"}
                  </button>
                </div>
              </form>
            </div>
          )}
      </Modal>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Auth;
