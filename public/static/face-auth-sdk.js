window.FaceAuthSDK = (function () {
  const baseURL = "https://facial-auth-frontend.vercel.app/";

  async function registerUser({
    appToken,
    email,
    fullName,
    role,
    password,
    faceImage,
  }) {
    const form = new FormData();
    form.append("email", email);
    form.append("full_name", fullName);
    form.append("role", role);
    form.append("password", password);
    form.append("face_image", faceImage);

    const res = await fetch(`${baseURL}/apps/${appToken}/register/`, {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
    return data;
  }

  async function loginUser({ appToken, faceImage }) {
    const form = new FormData();
    form.append("face_image", faceImage);

    const res = await fetch(`${baseURL}/apps/${appToken}/face-login/`, {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
    return data;
  }

  return {
    register: registerUser,
    login: loginUser,
  };
})();
