import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, UserCircle2 } from "lucide-react";
import axios from "axios";

// "firstName": "Sunny",
//     "lastName": "Mallick",
//     "c": "admin",
//     "password": "Admin@123",
//     "emailAddress": "admin@gmail.com",
//     "role": "admin"

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // Payload this name will be chnaged
  const [role, setRole] = useState("customer");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    email: "",
    role: "",
  });
  const handleSubmit = async () => {
    let newError: any = {};

    if (!firstName) {
      newError.firstName = "First name is required";
    }
    if (!lastName) {
      newError.lastName = "Last name is required";
    }
    if (!userName) {
      newError.userName = "User name is required";
    }
    if (!email) {
      newError.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      newError.email = "email is not valid";
    }
    if (!password) {
      newError.password = "Password is required";
    }
    if (!role) {
      newError.role = "Role is required";
    }

    setErrors(newError);

    try {
      const payload = {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        password: password,
        emailAddress: email,
        role: role
      };

      const responce = await axios.post(
        `http://localhost:5184/api/Auth/Signup`,
        payload
      );
      console.log(responce)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-5">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden lg:block relative">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200"
            alt="Shopping"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute bottom-12 left-10 text-white">
            <h1 className="text-5xl font-bold leading-tight">
              Join Our
              <br />
              Store Today
            </h1>

            <p className="mt-4 text-gray-200 max-w-sm">
              Create your account and start shopping with exclusive offers,
              discounts and fast delivery.
            </p>
          </div>
        </div>

        {/* Right Side */}

        <div className="flex items-center justify-center p-8 lg:p-14">
          <div className="w-full max-w-lg">
            <h2 className="text-4xl font-bold text-gray-900">Create Account</h2>

            <p className="mt-2 text-gray-500">
              Fill in your information to create an account.
            </p>

            {/* Name */}

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div>
                <label className="text-sm font-medium">First Name</label>

                <div className="mt-2 flex items-center h-12 border rounded-xl px-3 focus-within:border-orange-500">
                  <User className="w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="ml-3 w-full outline-none"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                {errors.firstName && (
                  <label className="text-red-500 text-sm">
                    {errors.firstName}
                  </label>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Last Name</label>

                <div className="mt-2 flex items-center h-12 border rounded-xl px-3 focus-within:border-orange-500">
                  <User className="w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Mallick"
                    className="ml-3 w-full outline-none"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                {errors.lastName && (
                  <label className="text-red-500 text-sm">
                    {errors.lastName}
                  </label>
                )}
              </div>
            </div>

            {/* Username */}

            <div className="mt-5">
              <label className="text-sm font-medium">Username</label>

              <div className="mt-2 flex items-center h-12 border rounded-xl px-3 focus-within:border-orange-500">
                <UserCircle2 className="w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Username"
                  className="ml-3 w-full outline-none"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              {errors.userName && (
                <label className="text-red-500 text-sm">
                  {errors.userName}
                </label>
              )}
            </div>

            {/* Email */}

            <div className="mt-5">
              <label className="text-sm font-medium">Email Address</label>

              <div className="mt-2 flex items-center h-12 border rounded-xl px-3 focus-within:border-orange-500">
                <Mail className="w-5 h-5 text-gray-400" />

                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  className="ml-3 w-full outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && (
                <label className="text-red-500 text-sm">{errors.email}</label>
              )}
            </div>

            {/* Password */}

            <div className="mt-5">
              <label className="text-sm font-medium">Password</label>

              <div className="mt-2 flex items-center h-12 border rounded-xl px-3 focus-within:border-orange-500">
                <Lock className="w-5 h-5 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="ml-3 w-full outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <label className="text-red-500 text-sm">
                  {errors.password}
                </label>
              )}
            </div>

            {/* Role */}

            <div className="mt-5">
              <label className="text-sm font-medium">Role</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 w-full h-12 border rounded-xl px-3 outline-none focus:border-orange-500"
              >
                <option value={"customer"}>User</option>
                <option value={"admin"}>Admin</option>
              </select>

              {errors.role && (
                <label className="text-red-500 text-sm">{errors.role}</label>
              )}
            </div>

            {/* Button */}

            <button
              onClick={handleSubmit}
              className="mt-8 h-12 w-full rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
            >
              Create Account
            </button>

            <p className="text-center mt-6 text-gray-500">
              Already have an account?
              <span className="text-orange-500 font-semibold cursor-pointer ml-2">
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
