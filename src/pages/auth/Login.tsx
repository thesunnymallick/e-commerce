import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({
    userName:"",
    password:""
  });

  const handleUserName = (e: any) => {
    setUserName(e.target.value);
  };

  const handlePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const handleLoginUser = async () => {
    let error: any = {
      userName:"",
      password:"",
    };
    if (!userName) {
      error.userName= "User name is required";
    }
    if(!password){
      error.password = "Password is required";
    }
    setErrors(error)
    try {
      if(error.userName || error.password) return; 
      const data = await axios.post("http://localhost:5184/api/Auth/Login", {
        userName,
        password,
      });
      console.log("api res : ", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200"
            alt="Fashion"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-12 left-10 text-white">
            <span className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium">
              NEW COLLECTION
            </span>

            <h1 className="mt-5 text-5xl font-bold leading-tight">
              Shop Your
              <br />
              Favorite Style
            </h1>

            <p className="mt-4 max-w-sm text-gray-200">
              Explore thousands of premium products with exciting discounts and
              fast delivery.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center p-8 lg:p-14">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold text-gray-900">
              Welcome Back 👋
            </h2>

            <p className="mt-2 text-gray-500">Sign in to continue shopping.</p>

            <div className="mt-8">
              <label className="mb-2 block text-sm font-medium">
                User Name
              </label>

              <div className="flex h-14 items-center rounded-xl border px-4 focus-within:border-orange-500">
                <User className="h-5 w-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Enter your user name"
                  className="ml-3 w-full bg-transparent outline-none"
                  value={userName}
                  onChange={(e) => handleUserName(e)}
                />

              </div>
             
               {
                  errors.userName  && <label className="text-red-500 text-sm">{errors.userName}</label>
               }
               
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">Password</label>

              <div className="flex h-14 items-center rounded-xl border px-4 focus-within:border-orange-500">
                <Lock className="h-5 w-5 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="ml-3 w-full bg-transparent outline-none"
                  value={password}
                  onChange={(e) => handlePassword(e)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>

               {
                 errors.password && <label className="text-red-500 text-sm">{errors.password}</label>
               }
            </div>

            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                Remember Me
              </label>

              <button className="text-sm font-medium text-orange-500 hover:text-orange-600">
                Forgot Password?
              </button>
            </div>

            <button
              onClick={handleLoginUser}
              className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 font-semibold text-white transition hover:bg-orange-600"
            >
              Login
              <ArrowRight size={18} />
            </button>

            <div className="relative my-8">
              <div className="border-t" />

              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-400">
                OR
              </span>
            </div>

            <button className="flex h-14 w-full items-center justify-center rounded-xl border transition hover:bg-gray-50">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="mr-3 h-6 w-6"
                alt="Google"
              />
              Continue with Google
            </button>

            <p className="mt-8 text-center text-gray-500">
              Don't have an account?
              <span className="ml-2 cursor-pointer font-semibold text-orange-500">
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
