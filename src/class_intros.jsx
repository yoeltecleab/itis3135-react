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

    // display mode: "slideshow" or "all"
    const [displayMode, setDisplayMode] = useState("slideshow");

    // field visibility toggles
    const [showFields, setShowFields] = useState({
        name: true,
        image: true,
        personalStatement: true,
        personalBackground: true,
        professionalBackground: true,
        academicBackground: true,
        subjectBackground: true,
        primaryComputer: true,
        courses: true
    });

    function toggleField(field) {
        setShowFields((prev) => ({...prev, [field]: !prev[field]}));
    }

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

    // keyboard navigation: left / right (only in slideshow mode)
    useEffect(() => {
        function onKey(e) {
            if (displayMode !== "slideshow") return;
            if (filtered.length === 0) return;
            if (e.key === "ArrowLeft") {
                setFilteredIndex((i) => (i - 1 + filtered.length) % filtered.length);
            } else if (e.key === "ArrowRight") {
                setFilteredIndex((i) => (i + 1) % filtered.length);
            }
        }

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [filtered, displayMode]);

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

    // render a single student card based on field visibility
    function renderStudentCard(student, index = null) {
        return (
            <article key={index} className="student-card">
                {showFields.name && (
                    <h3 className="student-name">
                        {((student["name"] && student["name"]["first"]) || "") + " "}
                        {student["name"] && student["name"]["middleInitial"] ? student["name"]["middleInitial"] + " " : ""}
                        {((student["name"] && student["name"]["last"]) || "") + " "}
                        {student["divider"] ? student["divider"] + " " : ""}
                        {student["mascot"] ? student["mascot"] : ""}
                    </h3>
                )}

                {showFields.image && (
                    <figure className="student-figure">
                        {student["media"] && student["media"]["src"] ? (
                            <img
                                src={("https://dvonb.xyz" + student["media"]["src"])}
                                alt={`Portrait of ${((student["name"] && student["name"]["first"]) || "")} ${((student["name"] && student["name"]["last"]) || "")}`}/>
                        ) : (
                            <div className="no-image">No image</div>
                        )}
                        <figcaption>{(student["media"] && student["media"]["caption"]) || ""}</figcaption>
                    </figure>
                )}

                {showFields.personalStatement && student["personalStatement"] && (
                    <p className="personal-statement">{student["personalStatement"]}</p>
                )}

                <ul className="background-list">
                    {showFields.personalBackground && (student["backgrounds"] && student["backgrounds"]["personal"]) && (
                        <li>
                            <b>Personal Background: </b>{student["backgrounds"]["personal"]}
                        </li>
                    )}
                    {showFields.professionalBackground && (student["backgrounds"] && student["backgrounds"]["professional"]) && (
                        <li>
                            <b>Professional Background: </b>{student["backgrounds"]["professional"]}
                        </li>
                    )}
                    {showFields.academicBackground && (student["backgrounds"] && student["backgrounds"]["academic"]) && (
                        <li>
                            <b>Academic Background: </b>{student["backgrounds"]["academic"]}
                        </li>
                    )}
                    {showFields.subjectBackground && (student["backgrounds"] && student["backgrounds"]["subject"]) && (
                        <li>
                            <b>Subject Background: </b>{student["backgrounds"]["subject"]}
                        </li>
                    )}
                    {showFields.primaryComputer && (student["platform"] && student["platform"]["device"]) && (
                        <li>
                            <b>Primary Computer: </b>{student["platform"]["device"] + " - " + student["platform"]["os"]}
                        </li>
                    )}
                    {showFields.courses && student["courses"] && student["courses"].length > 0 && (
                        <li>
                            <b>Courses: </b>
                            <ul>
                                {student["courses"].map((course, ci) =>
                                    <li key={ci}>
                                        <b>{((course["code"] || "").replace("-", "") + " - " + (course["name"] || "") + ": ")}</b>
                                        {course["reason"] || ""}
                                    </li>
                                )}
                            </ul>
                        </li>
                    )}
                </ul>
                <hr/>
            </article>
        );
    }

    return (<>
        <main>
            <h2>Class Introductions</h2>

            {error && <p className="error">Error: {error}</p>}

            {/* Display mode toggle */}
            <div className="display-mode-controls">
                <button
                    className={`mode-button ${displayMode === "slideshow" ? "active" : ""}`}
                    onClick={() => setDisplayMode("slideshow")}
                >
                    📊 Slideshow Mode
                </button>
                <button
                    className={`mode-button ${displayMode === "all" ? "active" : ""}`}
                    onClick={() => setDisplayMode("all")}
                >
                    📋 Display All
                </button>
            </div>

            {/* Field visibility toggles */}
            <details className="field-toggles">
                <summary>⚙️ Toggle Fields</summary>
                <div className="checkbox-grid">
                    <label>
                        <input
                            type="checkbox"
                            checked={showFields.name}
                            onChange={() => toggleField("name")}
                        />
                        Show Name
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showFields.image}
                            onChange={() => toggleField("image")}
                        />
                        Show Image
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showFields.personalStatement}
                            onChange={() => toggleField("personalStatement")}
                        />
                        Show Personal Statement
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showFields.personalBackground}
                            onChange={() => toggleField("personalBackground")}
                        />
                        Show Personal Background
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showFields.professionalBackground}
                            onChange={() => toggleField("professionalBackground")}
                        />
                        Show Professional Background
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showFields.academicBackground}
                            onChange={() => toggleField("academicBackground")}
                        />
                        Show Academic Background
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showFields.subjectBackground}
                            onChange={() => toggleField("subjectBackground")}
                        />
                        Show Subject Background
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showFields.primaryComputer}
                            onChange={() => toggleField("primaryComputer")}
                        />
                        Show Primary Computer
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showFields.courses}
                            onChange={() => toggleField("courses")}
                        />
                        Show Courses
                    </label>
                </div>
            </details>

            {/* Controls: search, jump input, select */}
            <div className="student-controls">
                <label className="control-group">
                    <span className="control-label">Search</span>
                    <input aria-label="Search students" type="search" className="search-input" value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           placeholder="Type a name (first, last, or both)"/>
                </label>

                {displayMode === "slideshow" && (
                    <>
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
                            <select aria-label="Jump to student by name" className="select-input"
                                    onChange={onSelectJump}
                                    value={filtered.length ? String(filteredIndex) : ""}>
                                <option value="">-- choose --</option>
                                {filtered.map((s, i) => (
                                    <option key={i} value={String(i)}>{i + 1}. {displayName(s)}</option>
                                ))}
                            </select>
                        </label>
                    </>
                )}

                <div className="controls-meta">
                    <small>{filtered.length} of {intros.length} students shown</small>
                </div>
            </div>

            {filtered.length === 0 && !error &&
                <p className="no-results">No students found matching "{searchTerm}".</p>}

            {/* Slideshow mode: show one student at a time with navigation */}
            {displayMode === "slideshow" && current && (
                <section className="student-viewer">
                    <div className="nav-controls">
                        <button aria-label="Previous student" className="nav-button" onClick={prev}>← Prev</button>
                        <span className="nav-counter"> {filteredIndex + 1} / {filtered.length} </span>
                        <button aria-label="Next student" className="nav-button" onClick={next}>Next →</button>
                    </div>

                    {renderStudentCard(current)}

                    <div className="nav-controls-bottom">
                        <button aria-label="Previous student" className="nav-button" onClick={prev}>← Prev</button>
                        <button aria-label="Next student" className="nav-button" onClick={next}>Next →</button>
                    </div>
                </section>
            )}

            {/* Display All mode: show all students */}
            {displayMode === "all" && filtered.length > 0 && (
                <section className="all-students">
                    {filtered.map((student, idx) => renderStudentCard(student, idx))}
                </section>
            )}

        </main>
    </>)
}