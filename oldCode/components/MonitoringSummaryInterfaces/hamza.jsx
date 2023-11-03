import React, { useState } from "react";
import { Col, Row } from "antd";
const hamza = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [org, setOrg] = useState("");
  const [job, setJob] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name,
      email,
      contact,
      org,
      job,
    };
    console.log(data);
  };
  return (
    <div>
      <div style={{ marginLeft: "10%", marginRight: "10%" }}>
        <Row>
          <Col xs={{ span: 8 }} md={{ span: 8 }} lg={{ span: 8 }}>
            <p style={{ textAlign: "left" }}>Raza</p>
          </Col>
          <Col xs={{ span: 8 }} md={{ span: 8 }} lg={{ span: 8 }}>
            <p style={{ textAlign: "center" }}>Raza</p>
          </Col>
          <Col xs={{ span: 8 }} md={{ span: 8 }} lg={{ span: 8 }}>
            <p style={{ textAlign: "right" }}>Raza</p>
          </Col>
        </Row>
        <h2 style={{ textAlign: "left", fontWeight: 600 }}>
          NETS MonetX: The revolutionary Technology Assets Management and
          Unified Observability Platform
        </h2>
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }}>
            <>
              <h3
                style={{ textAlign: "left", padding: "15px", fontWeight: 600 }}
              >
                Register for this event
              </h3>
              <form
                onSubmit={handleSubmit}
                style={{ textAlign: "left", padding: "15px" }}
              >
                <label>Name</label> &nbsp;
                <span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                <br />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                    width: "100%",
                    padding: "3px",
                    borderRadius: "4px",
                  }}
                />
                <br />
                <br />
                <label>Email</label>&nbsp;
                <span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                <br />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                    width: "100%",
                    padding: "3px",
                    borderRadius: "4px",
                  }}
                />
                <br />
                <br />
                <label>Contact Number</label>&nbsp;
                <span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                <br />
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                    width: "100%",
                    padding: "3px",
                    borderRadius: "4px",
                  }}
                />
                <br />
                <br />
                <label>Organization</label>&nbsp;
                <span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                <br />
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                    width: "100%",
                    padding: "3px",
                    borderRadius: "4px",
                  }}
                />
                <br />
                <br />
                <label>Job title</label>&nbsp;
                <span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                <br />
                <input
                  type="text"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                    width: "100%",
                    padding: "3px",
                    borderRadius: "4px",
                  }}
                />
                <br />
                <br />
                <input
                  type={"submit"}
                  style={{
                    width: "80%",
                    borderRadius: "5px",
                    padding: "5px",
                    border: "none",
                  }}
                />
              </form>
            </>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 16 }}
            lg={{ span: 16 }}
            style={{ textAlign: "left", padding: "15px" }}
          >
            <h3 style={{ textAlign: "left", fontWeight: 600 }}>
              Event details
            </h3>
            <p style={{ color: "rgba(0,0,0,0.5)", fontWeight: 600 }}>
              {" "}
              22/11/2022, 09:30 am – 3:00 pm
            </p>
            <p style={{ color: "rgba(0,0,0,0.5)", fontWeight: 600 }}>
              Radisson Blu Hotel, Dubai Waterfront, Marasi Dr, Business Bay,
              Dubai
            </p>
            <p style={{ color: "rgba(0,0,0,0.5)" }}>
              NETS International would like to invite you to attend the launch
              of <b>“MonetX”</b>, a revolutionary vendor-agnostic Technology
              Assets Management and Unified Network Observability platform,
              combining critical information from various network devices giving
              powerful interactive unified dashboards for improved visibility
              and actionable insights.
            </p>
            <p style={{ color: "rgba(0,0,0,0.5)" }}>
              In short, <b>“MonetX”</b> is all your network operations unified
              in a single view.
            </p>
            <p style={{ color: "rgba(0,0,0,0.5)" }}>
              Witness <b>“MonetX”</b> live in action, gain valuable industry
              insights, interact with our leadership and technical teams, as
              well as a chance to win exciting prizes.
            </p>
            <br />
            <p style={{ color: "rgba(0,0,0,0.5)" }}>Regards,</p>
            <br />
            <p style={{ color: "rgba(0,0,0,0.5)" }}>The NETS UAE Team</p>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default hamza;
