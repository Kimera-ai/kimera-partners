import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, we'll just navigate to dashboard
    toast({
      title: "Welcome back!",
      description: "Successfully logged in to your account.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#100919] flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 bg-card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your partner account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-200">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-200">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm text-gray-200">
                Remember me
              </label>
            </div>
            <Button variant="link" className="text-primary p-0">
              Forgot password?
            </Button>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;