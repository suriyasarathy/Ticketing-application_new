import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, Form } from "react-bootstrap";
import CommentSection from "../../components/CommentSection";
export default function TicketEditPage() {
    const { Ticket_id, project_id } = useParams();
    const currentUserId = Number(localStorage.getItem("user_id"));
    const [ticket, setTicket] = useState(null);
    
    const [priorities, setPriorities] = useState([]);
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        fetchTicketDetails();
        fetchComments();
        fetchProjectSettings(); // ✅ Fix: Now calling project settings API
    }, []);

    const fetchTicketDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/project/ticket/${Ticket_id}`);
            if (res.data.ticket && res.data.ticket.length > 0) {
                setTicket(res.data.ticket[0]);  // Set the first object from the array
            } else {
                console.error("No ticket data found");
            }
        } catch (error) {
            console.error("Error fetching ticket:", error);
        }
    };

    const fetchProjectSettings = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/projects/${project_id}/settings`);
            setPriorities(res.data.priorities || []);  
            setStatuses(res.data.statuses || []); 
        } catch (error) {
            console.error("Error fetching project settings:", error);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/commentdisplay?ticket_id=${Ticket_id}`);
            setComments(res.data);
            console.log(res.data);
            
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleUpdateTicket = async () => {
        try {
            if (!Ticket_id) {
                alert("Ticket ID is missing!");
                return;
            }
    
            await axios.put(`http://localhost:3000/project/ticket/update/${Ticket_id}`, ticket);
            alert("Ticket updated successfully!");
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };
    

    if (!ticket) return <p>Loading ticket...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Edit Ticket</h2>
            <Card className="p-4 my-4">
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={ticket.Tittle}
                        onChange={(e) => setTicket({ ...ticket, Tittle: e.target.value })}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={ticket.description}
                        onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                        value={ticket.priority}
                        onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
                    >
                        {priorities.length > 0 ? (
                            priorities.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))
                        ) : (
                            <option value="">No priorities found</option>
                        )}
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        value={ticket.status}
                        onChange={(e) => setTicket({ ...ticket, status: e.target.value })}
                    >
                        {statuses.length > 0 ? (
                            statuses.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))
                        ) : (
                            <option value="">No statuses found</option>
                        )}
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={ticket.Due_date ? ticket.Due_date.split("T")[0] : ""}
                        onChange={(e) => setTicket({ ...ticket, Due_date: e.target.value })}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Tagging</Form.Label>
                    <Form.Control
                        type="text"
                        value={ticket.Tagging}
                        onChange={(e) => setTicket({ ...ticket, Tagging: e.target.value })}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Control type="text" value={ticket.type} disabled />
                </Form.Group>

                <Form.Group>
                    <Form.Label>IP Address</Form.Label>
                    <Form.Control type="text" value={ticket.Ip_address} disabled />
                </Form.Group>

                <Button className="mt-3" onClick={handleUpdateTicket}>
                    Save Changes
                </Button>
            </Card>

            {/* Comments Section */}
            {/* Comments Section */}
<h3 className="text-lg font-bold">Comments</h3>

<CommentSection ticketId={Ticket_id}  />
        </div>
    );
}
