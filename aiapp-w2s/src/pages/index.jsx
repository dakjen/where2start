import Layout from "./Layout.jsx";

import Chat from "./Chat";
import AskAQuestion from "./AskAQuestion"; // Import new component
import BusinessBasics from "./BusinessBasics"; // Import new component

import Welcome from "./Welcome";

import ChatHistory from "./ChatHistory";

import Businesses from "./Businesses";

import SavedChats from "./SavedChats";

import Admin from "./Admin";

import Profile from "./Profile";

import Referrals from "./Referrals";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Chat: Chat,
    AskAQuestion: AskAQuestion, // Add to PAGES object
    BusinessBasics: BusinessBasics, // Add to PAGES object
    Welcome: Welcome,
    ChatHistory: ChatHistory,
    Businesses: Businesses,
    SavedChats: SavedChats,
    Admin: Admin,
    Profile: Profile,
    Referrals: Referrals,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                <Route path="/" element={<Chat />} />
                <Route path="/Chat" element={<Chat />} />
                <Route path="/AskAQuestion" element={<AskAQuestion />} /> {/* Add new route */}
                <Route path="/BusinessBasics" element={<BusinessBasics />} /> {/* Add new route */}
                <Route path="/Welcome" element={<Welcome />} />
                
                <Route path="/ChatHistory" element={<ChatHistory />} />
                
                <Route path="/Businesses" element={<Businesses />} />
                
                <Route path="/SavedChats" element={<SavedChats />} />
                
                <Route path="/Admin" element={<Admin />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Referrals" element={<Referrals />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}