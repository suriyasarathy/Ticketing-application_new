import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ClientForm = ({ initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    language: "",
    time_zone: "",
    department: "",
    location: "",
    created_at: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        created_at: new Date(initialData.created_at).toLocaleString(),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/ClientAdd",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Client Created Successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating client. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header as="h5">
          {initialData ? "Edit Client" : "Add New Client"}
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formPhone" className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCompany" className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formLanguage" className="mb-3">
                  <Form.Label>Preferred Language</Form.Label>
                  <Form.Select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                  >
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formTimezone" className="mb-3">
                  <Form.Label>Time Zone</Form.Label>
                  <Form.Select
                    name="time_zone"
                    value={formData.time_zone}
                    onChange={handleChange}
                  >
                    <option value="">Select time zone</option>
                    <option value="UTC">UTC</option>
                    <option value="IST">IST (India)</option>
                    <option value="EST">EST (US East)</option>
                    <option value="PST">PST (US West)</option>
                    <option value="CET">CET (Europe)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formDepartment" className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter department name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formLocation" className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                  />
                </Form.Group>
              </Col>
            </Row>

            {initialData && (
              <Form.Group controlId="formCreatedAt" className="mb-3">
                <Form.Label>Created At</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.created_at}
                  readOnly
                />
              </Form.Group>
            )}

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClientForm;
