import * as React from "react";
import { createRoot } from "react-dom/client";
import mermaid from "mermaid";
import { getSelectionPlainText } from "./utils";

const renderContainer = "renderContainer";
function App() {
    const svgRenderRef = React.useRef<HTMLDivElement>(null);
    const [error, setError] = React.useState<string>();

    const mermaidRender = (content: string) => {
        const svgResult = mermaid.render(renderContainer, content);
        console.log({ svgResult });
        if (svgRenderRef.current) {
            svgRenderRef.current.innerHTML = svgResult;
        }
    };

    React.useEffect(() => {
        getSelectionPlainText().then((result) => {
            if (result.type === "error") {
                setError(result.message);
            }

            if (result.type === "success" && result.payload.length) {
                mermaidRender(result.payload);
            }
        });
    }, []);

    return (
        <div className="grid wrapper">
            <div className="cs1 ce12">
                {error && (
                    <div className="form-group">
                        {" "}
                        <label>Error</label> <p>{error}</p>{" "}
                    </div>
                )}
                <div ref={svgRenderRef}></div>
                <div id={renderContainer}></div>
            </div>
        </div>
    );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
