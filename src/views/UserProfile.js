// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
// import { useAuth } from "./ContextData";
// import { Dropdown } from "react-bootstrap";
// import { FaPen } from "react-icons/fa";
// import { Modal } from "react-bootstrap";

// function User() {
//   const [userId, setUserId] = useState(null);
// const [showMenu, setShowMenu] = useState(false);
// const [showImageModal, setShowImageModal] = useState(false);
// const [selectedFile, setSelectedFile] = useState(null);
// const [uploading, setUploading] = useState(false);


//   const { user } = useAuth();
//   console.log("user", user);

//   useEffect(() => {
//     if (user?.userId) {
//       setUserId(user.userId);
//     }
//   }, [user]);
//   const storedId =userId;
//   const [loading, setLoading] = useState(false);
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//       if (!storedId) return; // Prevent fetch if no ID

//     const fetchUserProfile = async () => {
//       try {
//         const response = await fetch(`http://localhost:3000/userProfile?id=${storedId}`);
//         if (!response.ok) throw new Error("Failed to fetch user data");

//         const data = await response.json();
//         setUserData(data);
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//       }
//     };

//     fetchUserProfile();
//   }, [storedId]);

//   const handlePasswordChange = async () => {
//     if (!window.confirm("Do you want to reset your password?")) return;

//     setLoading(true);
//     setTimeout(() => alert("Processing request... Please wait."), 500);

//     try {
//       const response = await fetch("http://localhost:3000/send-reset-email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: userData?.email }),
//       });

//       const result = await response.json();
//       response.ok ? alert("Password reset link sent!") : alert(result.message);
//     } catch (error) {
//       alert("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//   if (e.target.files && e.target.files[0]) {
//     setSelectedFile(e.target.files[0]);

//     // Show preview instantly
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setUserData({ ...userData, profile_image: event.target.result }); // temporary preview
//     };
//     reader.readAsDataURL(e.target.files[0]);
//   }
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!storedId) {
//     alert("User ID is missing. Please log in again.");
//     return;
//   }

//   if (!window.confirm("Do you want to update your profile?")) return;

//   setLoading(true);

//   try {
//     const formData = new FormData();
//     formData.append("id", storedId);
//     formData.append("name", userData.name);
//     formData.append("aboutMe", userData.about_me);

//     if (selectedFile) {
//       formData.append("profileImage", selectedFile);
//     }

//     const response = await fetch("http://localhost:3000/updateUserProfile", {
//       method: "PUT",
//       body: formData,
//     });

//     const result = await response.json();

//     if (response.ok) {
//       alert("Profile updated successfully!");
//       setSelectedFile(null);
//     } else {
//       alert(result.message || "Failed to update profile.");
//     }
//   } catch (error) {
//     alert("An error occurred while updating the profile.");
//   } finally {
//     setLoading(false);
//   }
// };

  
//   if (!userData) return <p>Loading user data...</p>;

//   return (
//     <Container fluid>
//       <Row>
//         <Col md="8">
//           <Card>
//             <Card.Header>
//               <Card.Title as="h4">Edit Profile</Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <Form onSubmit={handleSubmit}>
//                 <Row>
//                   <Col className="pr-1" md="6">
//                     <Form.Group>
//                       <label>Username</label>
//                       <Form.Control
//                         name="username"
//                         value={userData.name || ""}
//                         onChange={(e) =>
//                           setUserData({ ...userData, name: e.target.value })
//                         }
//                         type="text"
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col className="pl-1" md="6">
//                     <Form.Group>
//                       <label>Email</label>
//                       <Form.Control
//                         name="email"
//                         value={userData.email || ""}
//                         type="email"
//                         readOnly
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Row>
//                   <Col md="12">
//                     <Form.Group>
//                       <label>About Me</label>
//                      <Form.Control
//   name="aboutMe"
//   value={userData.about_me || ""}
//   onChange={(e) =>
//     setUserData({ ...userData, about_me: e.target.value })
//   }
//   as="textarea"
//   rows="4"
// />

//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Button className="btn-fill pull-right" type="submit" variant="info">
//                   Update Profile
//                 </Button>
//                 <div className="clearfix"></div>
//               </Form>
//             </Card.Body>
//           </Card>

//           <Card>
//             <Card.Body>
//               <Button variant="danger" onClick={handlePasswordChange} disabled={loading}>
//                 {loading ? "Sending..." : "Change Password"}
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md="4">
//   <Card className="card-user text-center p-3 shadow">
//     <Card.Body>
    
//       <div className="author">
//       <div style={{ position: "relative", width: "fit-content", margin: "10px auto" }}>
//   <img
//     alt="User"
//     className="avatar border-gray"
//     src={
//       userData.profile_image
//         ? `http://localhost:3000/uploads/${userData.profile_image.split('/').pop()}`
//         : "https://www.w3schools.com/w3images/avatar2.png"
//     }
//     style={{
//       width: "120px",
//       height: "120px",
//       borderRadius: "50%",
//       display: "block",
//       objectFit: "cover",
//     }}
//     onMouseEnter={() => setShowMenu(true)}
//     onMouseLeave={() => setShowMenu(false)}
//   />

//   <div
//     style={{
//       position: "absolute",
//       top: "5px",
//       right: "5px",
//       background: "#fff",
//       borderRadius: "50%",
//       padding: "5px",
//       boxShadow: "0 0 5px rgba(0,0,0,0.2)",
//       cursor: "pointer",
//     }}
//     onMouseEnter={() => setShowMenu(true)}
//     onMouseLeave={() => setShowMenu(false)}
//   >
//     <Dropdown show={showMenu} onToggle={() => setShowMenu(!showMenu)}>
//       <Dropdown.Toggle
//         variant="light"
//         id="dropdown-basic"
//         style={{
//           background: "none",
//           border: "none",
//           padding: "0",
//           fontSize: "16px",
//         }}
//       >
//         <FaPen />
//       </Dropdown.Toggle>

//       <Dropdown.Menu style={{ fontSize: "14px" }}>
//         <Dropdown.Item onClick={() => alert("Viewing image...")}>View Image</Dropdown.Item>
//         <Dropdown.Item onClick={() => alert("Update image flow...")}>Update Image</Dropdown.Item>
//         <Dropdown.Item onClick={() => alert("Remove image...")}>Remove Image</Dropdown.Item>
//       </Dropdown.Menu>
//     </Dropdown>
//   </div>
// </div>

//         <h5 className="title mt-2">{userData.name}</h5>
//         <p className="description font-weight-bold">Role: {userData.role_name || "Not Assigned"}</p>

//         <hr />

//         <p className="description font-weight-bold">Teams:</p>
//         <ul className="list-unstyled">
//           {userData.teams?.length > 0 ? (
//             userData.teams.map((team, index) => <li key={index}>{team}</li>)
//           ) : (
//             <li className="text-muted">No team assigned</li>
//           )}
//         </ul>

//         <p className="description font-weight-bold">Projects:</p>
//         <ul className="list-unstyled">
//           {userData.projects?.length > 0 ? (
//             userData.projects.map((project, index) => <li key={index}>{project}</li>)
//           ) : (
//             <li className="text-muted">No project assigned</li>
//           )}
//         </ul>
//       </div>

//       <hr />
//       <p className="description text-center font-italic">
//         "{userData.about_me || "No bio available"}"
//       </p>
//     </Card.Body>
//   </Card>
// </Col>

//       </Row>
//     </Container>
//   );
// }

// export default User;

// import React, { useState, useEffect ,useRef} from "react";
// import { Button, Card, Form, Container, Row, Col, Modal, Dropdown } from "react-bootstrap";
// import { useAuth } from "./ContextData";
// import { FaPen } from "react-icons/fa";

// function User() {
//   const { user } = useAuth();
//   const [userId, setUserId] = useState(null);
//   const [userData, setUserData] = useState();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showImageModal, setShowImageModal] = useState(false);
// const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (user?.userId) setUserId(user.userId);
//   }, [user]);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (!userId) return;
//       try {
//         const response = await fetch(`http://localhost:3000/userProfile?id=${userId}`);
//         const data = await response.json();
//         setUserData(data);
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//       }
//     };
//     fetchUserProfile();
//   }, [userId]);

//   const handlePasswordChange = async () => {
//     if (!window.confirm("Do you want to reset your password?")) return;
//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:3000/send-reset-email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: userData?.email }),
//       });
//       const result = await response.json();
//       alert(response.ok ? "Password reset link sent!" : result.message);
//     } catch (error) {
//       alert("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setUserData({ ...userData, profile_image: event.target.result }); // Preview
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!userId) return alert("User ID missing.");
//     if (!window.confirm("Update profile?")) return;

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("id", userId);
//       formData.append("name", userData.name);
//       formData.append("aboutMe", userData.about_me);
//       if (selectedFile) formData.append("profileImage", selectedFile);

//       const response = await fetch("http://localhost:3000/updateUserProfile", {
//         method: "PUT",
//         body: formData,
//       });

//       const result = await response.json();
//       alert(response.ok ? "Profile updated successfully!" : result.message);
//       if (response.ok) setSelectedFile(null);
//     } catch (error) {
//       alert("Error updating profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageRemove = async () => {
//     if (!window.confirm("Remove profile image?")) return;
//     try {
//       const res = await fetch(`http://localhost:3000/removeProfileImage?id=${userId}`, {
//         method: "DELETE",
//       });
//       const result = await res.json();
//       if (res.ok) {
//         alert("Image removed.");
//         setUserData({ ...userData, profile_image: "" });
//       } else {
//         alert(result.message);
//       }
//     } catch (err) {
//       alert("Error removing image.");
//     }
//   };

//   if (!userData) return <p>Loading user data...</p>;

//   const profileImgUrl =
//     userData.profile_image && !userData.profile_image.startsWith("data:")
//       ? `http://localhost:3000/uploads/${userData.profile_image.split("/").pop()}`
//       : userData.profile_image || "https://www.w3schools.com/w3images/avatar2.png";

//   return (
//     <Container fluid>
//       <Row>
//         <Col md="8">
//           <Card>
//             <Card.Header>
//               <Card.Title as="h4">Edit Profile</Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <Form onSubmit={handleSubmit}>
//                 <Row>
//                   <Col md="6">
//                     <Form.Group>
//                       <label>Username</label>
//                       <Form.Control
//                         value={userData.name || ""}
//                         onChange={(e) => setUserData({ ...userData, name: e.target.value })}
//                         type="text"
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md="6">
//                     <Form.Group>
//                       <label>Email</label>
//                       <Form.Control value={userData.email || ""} type="email" readOnly />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col md="12">
//                     <Form.Group>
//                       <label>About Me</label>
//                       <Form.Control
//                         as="textarea"
//                         rows="4"
//                         value={userData.about_me }
//                         onChange={(e) => setUserData({ ...userData, about_me: e.target.value })}
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Button className="btn-fill pull-right" type="submit" variant="info">
//                   Update Profile
//                 </Button>
//               </Form>
//             </Card.Body>
//           </Card>

//           <Card>
//             <Card.Body>
//               <Button variant="danger" onClick={handlePasswordChange} disabled={loading}>
//                 {loading ? "Sending..." : "Change Password"}
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md="4">
//           <Card className="card-user text-center p-3 shadow">
//             <Card.Body>
//               <div className="author">
//                 <div style={{ position: "relative", margin: "10px auto", width: "fit-content" }}>
//                   <img
//                     alt="User"
//                     className="avatar border-gray"
//                     src={profileImgUrl}
//                     style={{
//                       width: "120px",
//                       height: "120px",
//                       borderRadius: "50%",
//                       objectFit: "cover",
//                     }}
//                     onMouseEnter={() => setShowMenu(true)}
//                     onMouseLeave={() => setShowMenu(false)}
//                   />

//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "5px",
//                       right: "5px",
//                       background: "#fff",
//                       borderRadius: "50%",
//                       padding: "5px",
//                       boxShadow: "0 0 5px rgba(0,0,0,0.2)",
//                     }}
//                     onMouseEnter={() => setShowMenu(true)}
//                     onMouseLeave={() => setShowMenu(false)}
//                   >
//                    <Dropdown show={showMenu}>
//   <Dropdown.Toggle
//     variant="light"
//     style={{
//       background: "none",
//       border: "none",
//       padding: 0,
//       fontSize: "16px",
//     }}
//   >
//     <FaPen />
//   </Dropdown.Toggle>

//   <Dropdown.Menu>
//     <Dropdown.Item onClick={() => setShowImageModal(true)}>
//       View Image
//     </Dropdown.Item>

//     <Dropdown.Item onClick={() => fileInputRef.current.click()}>
//       Upload Image
//     </Dropdown.Item>

//     <Dropdown.Item onClick={handleImageRemove}>
//       Remove Image
//     </Dropdown.Item>
//   </Dropdown.Menu>
// </Dropdown>

// {/* Hidden file input goes here */}
// <Form.Control
//   ref={fileInputRef}
//   type="file"
//   accept="image/*"
//   style={{ display: "none" }}
//   onChange={handleFileChange}
// />


//                   </div>
//                 </div>

//                 <h5 className="title mt-2">{userData.name}</h5>
//                 <p className="description font-weight-bold">Role: {userData.role_name || "Not Assigned"}</p>

//                 <hr />
//                 <p className="description font-weight-bold">Teams:</p>
//                 <ul className="list-unstyled">
//                   {userData.teams?.length > 0 ? userData.teams.map((team, i) => <li key={i}>{team}</li>) : <li>No team assigned</li>}
//                 </ul>

//                 <p className="description font-weight-bold">Projects:</p>
//                 <ul className="list-unstyled">
//                   {userData.projects?.length > 0 ? userData.projects.map((p, i) => <li key={i}>{p}</li>) : <li>No project assigned</li>}
//                 </ul>
//               </div>

//               <hr />
//               <p className="description text-center font-italic">
//                 "{userData.about_me || "No bio available"}"
//               </p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Profile Image</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="text-center">
//           <img src={profileImgUrl} alt="Full View" style={{ maxWidth: "100%", maxHeight: "500px" }} />
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// }

// export default User;

import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Form, Container, Row, Col, Dropdown, Modal } from "react-bootstrap";
import { FaPen } from "react-icons/fa";
import { useAuth } from "./ContextData";
import { useNavigate } from "react-router-dom";

function User() {
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.userId) setUserId(user.userId);
  }, [user]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:3000/userProfile?id=${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [userId]);

  const handlePasswordChange = async () => {
    if (!window.confirm("Do you want to reset your password?")) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/send-reset-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData?.email }),
      });
      const result = await response.json();
      alert(response.ok ? "Password reset link sent!" : result.message);
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserData({ ...userData, profile_image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("User ID missing.");
    if (!window.confirm("Update profile?")) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", userId);
      formData.append("name", userData.name);
      formData.append("dob", userData.Date_of_birth);
      if (selectedFile) formData.append("profileImage", selectedFile);

      const response = await fetch("http://localhost:3000/updateUserProfile", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      alert(response.ok ? "Profile updated successfully!" : result.message);
      if (response.ok) setSelectedFile(null);
    } catch (error) {
      alert("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageRemove = async () => {
    if (!window.confirm("Remove profile image?")) return;
    try {
      const res = await fetch(`http://localhost:3000/removeProfileImage?id=${userId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        alert("Image removed.");
        setUserData({ ...userData, profile_image: "" });
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Error removing image.");
    }
  };

  if (!userData) return <p>Loading user data...</p>;

  const profileImgUrl =
    userData.profile_image && !userData.profile_image.startsWith("data:")
      ? `http://localhost:3000/uploads/${userData.profile_image.split("/").pop()}`
      : userData.profile_image || "https://www.w3schools.com/w3images/avatar2.png";

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Card className="p-4 shadow-sm mt-3">
          <Card.Body>
            <div className="d-flex justify-content-between">
              <h4>User Profile</h4>
              <div>
                <Button variant="secondary" className="me-2" type="button" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" variant="info">
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="text-center my-3 position-relative">
              <img
                src={profileImgUrl}
                alt="profile"
                style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }}
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
              />

              <div
                className="position-absolute"
                style={{ right: "calc(50% - 60px)", top: 5 }}
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
              >
                <Dropdown show={showMenu}>
                  <Dropdown.Toggle variant="light" style={{ background: "none", border: "none" }}>
                    <FaPen />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setShowImageModal(true)}>View Image</Dropdown.Item>
                    <Dropdown.Item onClick={() => fileInputRef.current.click()}>Upload Image</Dropdown.Item>
                    <Dropdown.Item onClick={handleImageRemove}>Remove Image</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                
                <Form.Control
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>User ID</Form.Label>
                  <Form.Control value={userId} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    value={userData.name || ""}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control value={userData.email || ""} readOnly />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control value={userData.role_name || "Not assigned"} readOnly />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control value={userData.department || "Not assigned"} readOnly />
                </Form.Group>
              </Col>
            </Row>

        <Row>
  <Col md={6}>
    <Form.Group className="mb-3">
      <Form.Label>Date of Birth</Form.Label>
      <Form.Control
  type="date"
  value={
    userData.Date_of_birth
      ? new Date(userData.Date_of_birth).toISOString().split("T")[0]
      : ""
  }
  onChange={(e) =>
    setUserData({ ...userData, Date_of_birth: e.target.value })
  }
/>

    </Form.Group>
  </Col>
</Row>


<Row>
  <Col>
    <Button variant="danger" onClick={handlePasswordChange} disabled={loading}>
      {loading ? "Sending..." : "Change Password"}
    </Button>
  </Col>
</Row>


           <Row className="mt-4">
  <Col md={6}>
    <Card>
      <Card.Body>
        <Card.Title>Teams</Card.Title>
        <ul className="mb-0">
          {userData.teams?.length > 0
            ? userData.teams.map((t, i) => <li key={i}>{t}</li>)
            : <li>No teams assigned</li>}
        </ul>
      </Card.Body>
    </Card>
  </Col>
  <Col md={6}>
    <Card>
      <Card.Body>
        <Card.Title>Projects</Card.Title>
        <ul className="mb-0">
          {userData.projects?.length > 0
            ? userData.projects.map((p, i) => <li key={i}>{p}</li>)
            : <li>No projects assigned</li>}
        </ul>
      </Card.Body>
    </Card>
  </Col>
</Row>

          </Card.Body>
        </Card>
      </Form>

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Profile Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img src={profileImgUrl} alt="Full View" style={{ maxWidth: "100%", maxHeight: "500px" }} />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default User;
