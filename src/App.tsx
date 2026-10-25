import "./App.css";
import Header from "./components/layout/Header";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FestivalListPage from "./pages/FestivalListPage";
import FestivalDetailPage from "./pages/FestivalDetailPage";

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/festivals" element={<FestivalListPage />}></Route>
          <Route path="/festivals/:id" element={<FestivalDetailPage />}></Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
