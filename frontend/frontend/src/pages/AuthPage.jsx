import { useState } from "react";
import API from "../api/config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = isLogin ? "/auth/login" : "/auth/signup";
            const { data } = await API.post(endpoint, formData);

            if (isLogin) {
                login({ ...data.user, token: data.token });
                toast.success("Login Successful!");
                navigate("/");
            } else {
                setIsLogin(true);
                toast.success("Signup Success! Please login.");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Something went wrong";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#121b22] via-[#00a884] to-[#121b22] flex items-center justify-center p-4">
            <div className="bg-[#1f2c33]/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
                <div className="flex justify-center mb-6">
                    <div className="bg-[#00a884] p-4 rounded-full shadow-lg animate-pulse">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.171.823-.299.043-.691.061-1.114-.076-.263-.085-.601-.213-1.042-.405-1.874-.813-3.085-2.73-3.179-2.855-.094-.125-.76-.999-.76-1.996 0-1 .517-1.492.702-1.701.185-.208.405-.261.54-.261.135 0 .27.001.389.006.121.005.285-.046.446.339.162.384.558 1.36.606 1.458.049.098.081.211.016.339-.065.128-.098.208-.195.319-.098.112-.205.249-.293.334-.098.098-.201.205-.087.401.114.196.502.827 1.077 1.338.741.658 1.366.861 1.562.959.196.098.312.081.428-.053.116-.134.502-.585.637-.784.135-.198.27-.165.455-.098.185.067 1.178.556 1.381.657.203.101.339.149.389.236.05.087.05.505-.094.91z" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-3xl font-extrabold text-center text-white mb-2">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-[#aebac1] text-center mb-8">
                    {isLogin ? "Login to start chatting" : "Join the modern chat experience"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full bg-[#2a3942] text-white p-4 pl-4 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent transition-all placeholder:text-[#8696a0]"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    )}
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-[#2a3942] text-white p-4 pl-4 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent transition-all placeholder:text-[#8696a0]"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-[#2a3942] text-white p-4 pl-4 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent transition-all placeholder:text-[#8696a0]"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00a884] text-white p-4 rounded-xl font-bold text-lg hover:bg-[#06cf9c] active:scale-[0.98] transition-all shadow-lg shadow-[#00a884]/20 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : isLogin ? "Login Now" : "Create Account"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-2">
                    <p className="text-[#aebac1] text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[#00a884] font-bold hover:text-[#06cf9c] transition-colors relative group"
                    >
                        {isLogin ? "Sign up for free" : "Back to Login"}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00a884] transition-all group-hover:w-full"></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
