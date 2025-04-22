import Navbar from "../components/navbar";
import React from "react";

export default function Team () {
    let message = 'The dev team';
    
    // Optional: mock image URLs (you can use real URLs later)
    const members = [
        { name: "Team Member Theloto", image: null },
        { name: "Team Member CaptnCrunch", image: null },
        { name: "Team Member LumenNoruega", image: null },
       /* { name: "Team Member D", image: null },*/
    ];

    return (
        <section className="section-white">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h2 className="section-title">
                            EVM Bootcamp Group 2
                        </h2>
                        <p className="section-subtitle">{message}</p>

                        <div className="col-sm-6 col-md-4">
                            {members.map((member, index) => (
                                <div className="team-item" key={index}>
                                    {member.image && (
                                        <img src={member.image} className="team-img" alt={`Photo of ${member.name}`} />
                                    )}
                                    <h3>{member.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
