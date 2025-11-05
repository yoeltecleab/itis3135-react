import yoel_image from './assets/Yoel.JPG';

const Introduction = () => {
    return (
        <main>
            <h2>Introduction</h2>
            <h2>Yoel Tecleab | Yawning Tiger</h2>
            <figure>
                <img alt="Portrait of Yoel Tecleab" src={yoel_image}/>
                <figcaption>Yoel Tecleab</figcaption>
            </figure>
            <ul>
                <li>
                    <b>Personal Background:</b> My hobbies include playing tennis, watching movies and hanging out with
                    friends.
                </li>
                <li>
                    <b>Academic Background:</b> I believe I am senior (confused because I am a part-time student and
                    have no
                    idea) majoring in Computer Science with tentative concentration in AI and Robotics (might end up
                    changing to
                    Software Engineering)
                </li>
                <li><b>Courses:</b>
                    <ul>
                        <li>
                            <b>ITIS3135 - Frontend Web App Development</b>
                            Taking it to gain knowledge in frontend frameworks, so I can build a complete website by
                            myself.
                        </li>
                        <li>
                            <b>ITSC3160 - Database Design and Implementation</b>
                            Taking it to know more about databases and their applications in application development.
                        </li>
                        <li>
                            <b>ITCS3153 - Introduction to Artificial Intelligence</b>
                            Taking it to learn about the evolution of AI, algorithms and how to create one of my own.
                        </li>
                    </ul>
                </li>
            </ul>
        </main>
    )
}

export default Introduction;