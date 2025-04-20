import Navbar from "../components/navbar";
import React from "react";

export default function Team () {
    let message = 'There are many';
    return (
        <section className="section-white">
            <div className="container">
                <div className="row">

                    <div className = "col-md-12 text-center">
                        <h2 className="section-title">
                            EVM Bootcamp Group 2
                        </h2>
                        <p className="section-subtitle">{message}</p>

                        <div className="col-sm-6 col-md-4">
                            <div className="team-item">
                                <img src="" className="team-img" alt="pic">
                                </img>
                                <h3> Team Member A</h3>
                            </div>
                            <div className="team-item">
                                <img src="" className="team-img" alt="pic">
                                </img>
                                <h3> Team Member B</h3>
                            </div>
                            <div className="team-item">
                                <img src="" className="team-img" alt="pic">
                                </img>
                                <h3> Team Member C</h3>
                            </div>
                            <div className="team-item">
                                <img src="" className="team-img" alt="pic">
                                </img>
                                <h3> Team Member D</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}