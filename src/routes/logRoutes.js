const express = require("express");
const prisma = require("../prisma");
const auth = require("../middleware/auth");
const limiter = require("../middleware/rateLimit");
const { generateHash } = require("../services/hashService");

const router = express.Router();

router.post("/", auth, limiter, async (req, res) => {
  try {
    const { actor, action, payload } = req.body;

    if (!actor || !action) {
      return res.status(400).json({
        message: "actor and action are required",
      });
    }

    const lastLog = await prisma.log.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    const previousHash = lastLog
      ? lastLog.currentHash
      : "GENESIS";

    const currentHash = generateHash(
      actor +
      action +
      JSON.stringify(payload || {}) +
      previousHash
    );

    const newLog = await prisma.log.create({
      data: {
        actor,
        action,
        payload: JSON.stringify(payload || {}),
        previousHash,
        currentHash,
      },
    });

    res.status(201).json({
      message: "Log created",
      log: newLog,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;