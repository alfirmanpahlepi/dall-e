import { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import "./App.css";

const initialApiKey = localStorage.getItem("apiKey") || "";

function App() {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const configuration = new Configuration({ apiKey });

  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    if (!apiKey) return window.location.reload();

    try {
      setLoading(true);
      const response = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: "512x512",
      });

      setResult(response.data.data[0].url ?? "");
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const clearAPIKey = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    let userApiKey = localStorage.getItem("apiKey") || "";

    if (userApiKey) return;

    userApiKey =
      window.prompt(
        "Enter your Open AI API key\nGet API key => https://platform.openai.com/account/api-keys"
      ) || "";

    setApiKey(userApiKey);

    localStorage.setItem("apiKey", userApiKey);
  }, []);

  return (
    <div className="app">
      <h1>React AI Image Generator</h1>
      {loading ? (
        <h2> Image generation in progress ... Please wait!</h2>
      ) : (
        <></>
      )}
      <form className="card" onSubmit={(e) => e.preventDefault()}>
        <input
          disabled={loading}
          className="text-input"
          placeholder="Enter a prompt"
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div>
          <button
            className="clear-button"
            disabled={loading}
            onClick={clearAPIKey}
            type="button"
          >
            Clear API Key
          </button>
          <button
            className="button"
            disabled={loading}
            onClick={generateImage}
            type="submit"
          >
            Generate Image
          </button>
        </div>
        {result.length > 0 ? (
          <img className="result-image" src={result} alt="Generated Image" />
        ) : (
          <></>
        )}
      </form>
      <p className="footer">Powered by OpenAI</p>
    </div>
  );
}

export default App;
