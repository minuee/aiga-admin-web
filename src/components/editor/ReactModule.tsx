
const ReactModule = () => {

    return (
        <>
            <div className="ql-formats">
                <select className="ql-header" defaultValue="7">
                    <option value="1">Header 1</option>
                    <option value="2">Header 2</option>
                    <option value="3">Header 3</option>
                    <option value="4">Header 4</option>
                    <option value="5">Header 5</option>
                    <option value="6">Header 6</option>
                    <option value="7">Normal</option>
                </select>
                <select className="ql-size" defaultValue="medium">
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="huge">Huge</option>
                </select>
                <select className="ql-font" defaultValue="sans-serif" />
            </div>
            <div className="ql-formats">
                <button className="ql-bold" id="ql-formats-bold" />
                <button className="ql-italic" id="ql-formats-italic" />
                <button className="ql-underline" id="ql-formats-underline" />
                <button className="ql-strike" id="ql-formats-strike" />
                <button className="ql-blockquote" id="ql-formats-blockquote" />
            </div>

            <div className="ql-formats">
                <button className="ql-list" value="ordered" id="ql-formats-list-ordered" />
                <button className="ql-list" value="bullet" id="ql-formats-list-bullet" />
                <button className="ql-indent" value="-1" id="ql-formats-indent-minus" />
                <button className="ql-indent" value="+1" id="ql-formats-index-plus" />
            </div>
            <div className="ql-formats">
                <select className="ql-color" />
                <select className="ql-background" />
                <select className="ql-align" />
            </div>
            <div className="ql-formats">
                <button className="ql-code-block" id="ql-formats-code-block" />
                <button className="ql-link" id="ql-formats-link" />
                <button className="ql-image" id="ql-format-image" />
            </div>
        </>
    )
}

export default ReactModule;