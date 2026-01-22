import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-black mb-3">
          Support Ticket Desk
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-700 mb-8 leading-relaxed">
          Access the platform to raise support requests
          <br />
          or manage tickets efficiently
        </p>

        {/* User button */}
        <button
          onClick={() => navigate("/user-register")}
          className="w-full bg-black text-white py-3 rounded-md text-sm font-medium mb-4
                     hover:bg-gray-900 transition"
        >
          Continue as User
        </button>

        {/* Admin button */}
        <button
          onClick={() => navigate("/login?role=admin")}
          className="w-full border border-black text-black py-3 rounded-md text-sm font-medium
                     hover:bg-black hover:text-white transition"
        >
          Login as Admin
        </button>

      </div>
    </div>
  );
}

export default Welcome;
