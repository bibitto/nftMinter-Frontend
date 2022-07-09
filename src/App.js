import './App.css';
import NftUploader from './components/NftUploader/NftUploader';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

function App() {
    return (
        <div className="App">
            <Header></Header>
            <NftUploader></NftUploader>
            <Footer></Footer>
        </div>
    );
}

export default App;
