import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent } from "@mui/material";
import ExchangeService from "../../Service/exchangeService";
import { useParams } from "react-router-dom";
import NavBar from "../NavBar";

const ExchangeList = () => {
  let { itemId } = useParams();
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchExchangeRequests();
  }, [itemId]);

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
