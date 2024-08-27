import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import ExchangeService from "../../Service/exchangeService";
import { useParams } from "react-router-dom";
import NavBar from "../NavBar";
import UserService from "../../Service/userService";

const ExchangeList = () => {
  let { itemId } = useParams();
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = UserService.getUserIdFromToken();
  console.log(UserService.getUserIdFromToken());

  const fetchExchangeRequests = async () => {
    try {
      // Await the promise returned by ExchangeService.fetchExchangeData
      const response = await ExchangeService.fetchExchangeData(itemId);
      // Ensure response.data is set correctly
      if (response && response.data) {
        setExchangeRequests(response.data);
      } else {
        setExchangeRequests([]);
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching exchange requests:", error);
      setExchangeRequests([]); // Set to an empty array in case of an error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRequests();
  }, [itemId]);

  const handleAccept = async (exchange, userRequest, status, userReceive) => {
    try {
      await ExchangeService.acceptExchange(exchange.exchangeId);
      // setExchangeRequests((prev) =>
      //   prev.map((ex) =>
      //     ex.exchangeId === exchangeId ? { ...ex, status: "ACCEPTED" } : ex
      //   )
      // );
      try {
        await ExchangeService.notificationConfirmationExchange(userRequest, exchange, status);
      } catch(error) {
      console.error("Error notifications:", error);
      }
      fetchExchangeRequests();
    } catch (error) {
      console.error("Error accepting exchange:", error);
    }
  };

  const handleReject = async (exchange, userRequest, status, userReceive) => {
    try {
      await ExchangeService.rejectExchange(exchange.exchangeId);
      // setExchangeRequests((prev) =>
      //   prev.map((ex) =>
      //     ex.exchangeId === exchangeId ? { ...ex, status: "REJECTED" } : ex
      //   )
      // );
      try {
        await ExchangeService.notificationConfirmationExchange(userRequest, exchange, status, userReceive);
      } catch(error) {
      console.error("Error notifications:", error);
      }
      fetchExchangeRequests();
    } catch (error) {
      console.error("Error rejecting exchange:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div style={{ marginTop: "1%" }}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Exchange Requests
          </Typography>
          <br />
          {isLoading ? (
            <Typography variant="body2" color="text.secondary">
              Loading...
            </Typography>
          ) : (
            <Box sx={{ width: "100%", maxWidth: 600 }}>
              {exchangeRequests.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No exchange requests found.
                </Typography>
              ) : (
                exchangeRequests.map((exchange) => (
                  <Card key={exchange.exchangeId} sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography variant="h6">
                        Exchange ID: {exchange.exchangeId}
                      </Typography>
                      <Typography>
                        Requester: {exchange.requester.name}
                      </Typography>
                      <Typography>
                        Receiver : {exchange.receiver.name}
                      </Typography>
                      <Typography>Status: {exchange.status}</Typography>
                      <Typography>
                        Created At:{" "}
                        {new Date(exchange.createdAt).toLocaleString()}
                      </Typography>
                      <Typography>
                        Updated At:{" "}
                        {new Date(exchange.updatedAt).toLocaleString()}
                      </Typography>
                      {exchange.receiver.user_id === userId && (
                        <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleAccept(exchange, exchange.requester, 'accepté', exchange.receiver)}
                            disabled={exchange.status !== "EN_ATTENTE"}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleReject(exchange,exchange.requester, 'refusé', exchange.receiver)}
                            disabled={exchange.status !== "EN_ATTENTE"}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          )}
        </Box>
      </div>
    </>
  );
};

export default ExchangeList;
