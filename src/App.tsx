import { HashRouter, Route, Routes } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Syllabus } from "@/pages/Syllabus";
import { Learn } from "@/pages/Learn";
import { Practice } from "@/pages/Practice";
import { Mock } from "@/pages/Mock";
import { Revise } from "@/pages/Revise";
import { Formulas } from "@/pages/Formulas";
import { Search } from "@/pages/Search";
import { NotFound } from "@/pages/NotFound";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/learn/:topicId" element={<Learn />} />
        <Route path="/practice/:topicId" element={<Practice />} />
        <Route path="/mock" element={<Mock />} />
        <Route path="/revise" element={<Revise />} />
        <Route path="/formulas" element={<Formulas />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
