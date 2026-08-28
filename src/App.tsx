import TopStreetLanding from "../referencias.jsx";
import PilotRegistration from "./pages/PilotRegistration";
import DigitalPassport from "./pages/DigitalPassport";
import AdminLogin from "./pages/AdminLogin";
import AdminScanner from "./pages/AdminScanner";
import PaymentUpload from "./pages/PaymentUpload";
import AdminRegistrations from "./pages/AdminRegistrations";
import PilotLogin from "./pages/PilotLogin";
import { useLocation } from "react-router-dom";

function App() {
  const { pathname: path } = useLocation();
  if (path === "/inscricao") return <PilotRegistration />;
  if (path === "/acesso") return <PilotLogin />;
  if (path === "/passaporte") return <DigitalPassport />;
  if (path === "/pagamento") return <PaymentUpload />;
  if (path === "/admin") return <AdminLogin />;
  if (path === "/admin/inscricoes") return <AdminRegistrations />;
  if (path === "/admin/scanner") return <AdminScanner />;
  return <TopStreetLanding />;
}

export default App;
