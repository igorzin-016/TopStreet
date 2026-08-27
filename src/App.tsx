import LandingPage from "./pages/LandingPage";
import PilotRegistration from "./pages/PilotRegistration";
import DigitalPassport from "./pages/DigitalPassport";
import AdminLogin from "./pages/AdminLogin";
import AdminScanner from "./pages/AdminScanner";

function App() {
  const path = window.location.pathname;
  if (path === "/inscricao") return <PilotRegistration />;
  if (path === "/passaporte") return <DigitalPassport />;
  if (path === "/admin") return <AdminLogin />;
  if (path === "/admin/scanner") return <AdminScanner />;
  return <LandingPage />;
}

export default App;
