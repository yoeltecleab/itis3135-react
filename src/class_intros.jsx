import {useEffect, useMemo, useState} from "react";

export default function Class_Intros() {
    const [intros, setIntros] = useState([]);
    const [error, setError] = useState(null);

    // index into the filtered list
    const [filteredIndex, setFilteredIndex] = useState(0);

    // search term used to filter by student name
    const [searchTerm, setSearchTerm] = useState("");

    // jump to input (string because user types)
    const [jumpValue, setJumpValue] = useState("");

    useEffect(() => {
        fetch("https://dvonb.xyz/api/2025-fall/itis-3135/students?full=1")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok." + response.statusText);
            })
            .then(async (data) => setIntros(await data))
            .catch((error) => setError(error.message))
    }, [])

    // build a case-insensitive display name for a student
    function displayName(stud) {
        if (!stud) return "";
        const first = (stud["name"] && stud["name"]["first"]) || "";
        const middle = (stud["name"] && stud["name"]["middleInitial"]) || "";
        const last = (stud["name"] && stud["name"]["last"]) || "";
        const parts = [first, middle, last].filter(Boolean);
        return parts.join(" ") || (stud["mascot"] || "Unnamed");
    }

    // filtered list based on searchTerm
    const filtered = useMemo(() => {
        const term = (searchTerm || "").trim().toLowerCase();
        if (!term) return intros;
        return intros.filter((s) => {
            const name = displayName(s).toLowerCase();
            return name.indexOf(term) !== -1;
        });
    }, [intros, searchTerm]);

    // ensure filteredIndex is valid when filtered list changes
    useEffect(() => {
        if (filtered.length === 0) {
            setFilteredIndex(0);
            return;
        }
        setFilteredIndex((i) => {
            if (i < 0) return 0;
            if (i >= filtered.length) return 0;
            return i;
        });
    }, [filtered]);

    // keyboard navigation: left / right
    useEffect(() => {
        function onKey(e) {
            if (filtered.length === 0) return;
            if (e.key === "ArrowLeft") {
                setFilteredIndex((i) => (i - 1 + filtered.length) % filtered.length);
            } else if (e.key === "ArrowRight") {
                setFilteredIndex((i) => (i + 1) % filtered.length);
            }
        }

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [filtered]);

    function prev() {
        if (filtered.length === 0) return;
        setFilteredIndex((i) => (i - 1 + filtered.length) % filtered.length);
    }

    function next() {
        if (filtered.length === 0) return;
        setFilteredIndex((i) => (i + 1) % filtered.length);
    }

    // jump to a 1-based page number within the filtered list
    function doJump() {
        const n = parseInt((jumpValue || "").trim(), 10);
        if (Number.isNaN(n)) return;
        if (n <= 0) return;
        if (n > filtered.length) return;
        setFilteredIndex(n - 1);
        setJumpValue("");
    }

    // jump by selecting a name from dropdown
    function onSelectJump(e) {
        const val = e.target.value;
        if (!val) return;
        const idx = parseInt(val, 10);
        if (!Number.isNaN(idx)) setFilteredIndex(idx);
    }

    const current = filtered.length > 0 ? filtered[filteredIndex] : null;

    return (<>
        <main>
            <h2>Class Introductions</h2>

            {error && <p className="error">Error: {error}</p>}

            {/* Controls: search, jump input, select */}
            <div className="student-controls">
                <label className="control-group">
                    <span className="control-label">Search</span>
                    <input aria-label="Search students" type="search" className="search-input" value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           placeholder="Type a name (first, last, or both)"/>
                </label>

                <label className="control-group">
                    <span className="control-label">Jump to #</span>
                    <input aria-label="Jump to student number" className="jump-input" type="number" min="1"
                           value={jumpValue}
                           onChange={(e) => setJumpValue(e.target.value)}
                           placeholder={filtered.length ? `1 - ${filtered.length}` : "-"}/>
                    <button className="nav-button" onClick={doJump}>Go</button>
                </label>

                <label className="control-group">
                    <span className="control-label">Or select</span>
                    <select aria-label="Jump to student by name" className="select-input" onChange={onSelectJump}
                            value={filtered.length ? String(filteredIndex) : ""}>
                        <option value="">-- choose --</option>
                        {filtered.map((s, i) => (
                            <option key={i} value={String(i)}>{i + 1}. {displayName(s)}</option>
                        ))}
                    </select>
                </label>

                <div className="controls-meta">
                    <small>{filtered.length} of {intros.length} students shown</small>
                </div>
            </div>

            {filtered.length === 0 && !error &&
                <p className="no-results">No students found matching "{searchTerm}".</p>}

            {current && (
                <section className="student-viewer">
                    <div className="nav-controls">
                        <button aria-label="Previous student" className="nav-button" onClick={prev}>← Prev</button>
                        <span className="nav-counter"> {filteredIndex + 1} / {filtered.length} </span>
                        <button aria-label="Next student" className="nav-button" onClick={next}>Next →</button>
                    </div>

                    <article className="student-card">
                        <h3 className="student-name">
                            {((current["name"] && current["name"]["first"]) || "") + " "}
                            {current["name"] && current["name"]["middleInitial"] ? current["name"]["middleInitial"] + " " : ""}
                            {((current["name"] && current["name"]["last"]) || "") + " "}
                            {current["divider"] ? current["divider"] + " " : ""}
                            {current["mascot"] ? current["mascot"] : ""}
                        </h3>
                        <figure className="student-figure">
                            {current["media"] && current["media"]["src"] ? (
                                <img
                                    src={("https://dvonb.xyz" + current["media"]["src"])}
                                    alt={`Portrait of ${((current["name"] && current["name"]["first"]) || "")} ${((current["name"] && current["name"]["last"]) || "")}`}/>
                            ) : (
                                <div className="no-image">No image</div>
                            )}

                            <figcaption>{(current["media"] && current["media"]["caption"]) || ""}</figcaption>
                        </figure>
                        <p className="personal-statement">{current["personalStatement"] || ""}</p>
                        <ul className="background-list">
                            <li>
                                <b>Personal
                                    Background: </b>{(current["backgrounds"] && current["backgrounds"]["personal"]) || ""}
                            </li>
                            <li>
                                <b>Professional
                                    Background: </b>{(current["backgrounds"] && current["backgrounds"]["professional"]) || ""}
                            </li>
                            <li>
                                <b>Academic
                                    Background: </b>{(current["backgrounds"] && current["backgrounds"]["academic"]) || ""}
                            </li>
                            <li>
                                <b>Subject
                                    Background: </b>{(current["backgrounds"] && current["backgrounds"]["subject"]) || ""}
                            </li>
                            <li>
                                <b>Primary
                                    Computer: </b>{(current["platform"] && current["platform"]["device"] + " - " + current["platform"]["os"]) || ""}
                            </li>
                            <li>
                                <b>Courses: </b>
                                <ul>
                                    {(current["courses"] || []).map((course, ci) =>
                                        <li key={ci}>
                                            <b>{((course["code"] || "").replace("-", "") + " - " + (course["name"] || "") + ": ")}</b>
                                            {course["reason"] || ""}
                                        </li>
                                    )}
                                </ul>
                            </li>
                        </ul>
                        <hr/>
                    </article>

                    <div className="nav-controls-bottom">
                        <button aria-label="Previous student" className="nav-button" onClick={prev}>← Prev</button>
                        <button aria-label="Next student" className="nav-button" onClick={next}>Next →</button>
                    </div>
                </section>
            )}

        </main>
    </>)
}