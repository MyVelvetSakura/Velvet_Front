import { Outlet } from "react-router";
import Header from "../components/organisms/Header/Header";
import MusicPlayer from "../components/molecules/MusicPlayer/MusicPlayer";

const Layout = () => {
    return (
        <>
            <Header/>
            <main><Outlet/></main>
            <MusicPlayer />
        </>
    )
}

export default Layout;