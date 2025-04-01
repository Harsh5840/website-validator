import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";

const app = express();
app.use(express.json());

app.post("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req.userId!; //if you are sure that something surely exists then use !
  const url = req.body; //whenever we use req.body we have to use app.use(express.json())
  const data = await prismaClient.website.create({
    ///we put the await in a constant
    data: {
      userId,
      url,
    },
  });

  res.json({
    id: data.id, //importanttttt
  });
});

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId as unknown as string //query paramters can either be string or array so we defined
  const userId = req.userId
  const data = await prismaClient.website.findFirst({
    where: {
        id: websiteId,
        userId: userId
    },
    include:{
        ticks: true   //the ticks array we mentioned
    }
  })
  res.json({
    data 
  })
});

app.get("/api/v1/websites", authMiddleware, async (req, res) => {
    const userId = req.userId;

   const websites =  await prismaClient.website.findMany({
        where: {
            userId,
            disabled : false
        }
    })
    res.json({
        websites
    })
});

app.delete("/api/v1/website", authMiddleware, async (req, res) => {
    const websiteId = req.body.websiteId;
    const userId = req.userId
    await prismaClient.website.update({ 
        where: {
            id: websiteId,
            userId
        },
        data:{
            disabled: true
        }
    })
    res.json({
        message: "deleted website succesfully"
    })
});

app.listen(3000);
