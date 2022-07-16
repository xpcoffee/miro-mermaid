/**
 * Returns the text content of the current user selection on the Miro board
 */
export async function getSelectionText(): Promise<
    { type: "error"; message: string } | { type: "success"; payload: string }
> {
    const selection = await miro.board.getSelection();

    if (selection.length > 1) {
        return { type: "error", message: "Too many items selected. Only select one." };
    }

    if (selection.length === 0) {
        return { type: "error", message: "No items selected. Select one item to render." };
    }

    const item = selection[0];
    if (item.type == "sticky_note") {
        return { type: "success", payload: item.content };
    }
    if (item.type == "text") {
        return { type: "success", payload: item.content };
    }

    return { type: "error", message: "Unable to get content from selection." };
}

/**
 * Returns the plain-text content of the current user selection on the Miro board
 */
export async function getSelectionPlainText(): Promise<
    { type: "error"; message: string } | { type: "success"; payload: string }
> {
    const result = await getSelectionText();
    if (result.type === "error") {
        return result;
    } else {
        const payload = htmlToText(result.payload);
        if (!payload) {
            return { type: "error", message: "Unable to convert selection into plaintext." };
        }

        return { ...result, payload: payload };
    }
}

/**
 * Returns plain text, given an HTML string.
 */
export const htmlToText = (htmlString: string): string => {
    const tmpElement = document.createElement("div");
    tmpElement.innerHTML = htmlString;
    return tmpElement.innerText;
};
