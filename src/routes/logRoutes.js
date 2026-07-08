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

router.get("/verify/all", async (req, res) => {
  try {
    const logs = await prisma.log.findMany({
      orderBy: {
        id: "asc"
      }
    });

    for (const log of logs) {

      const expectedHash = generateHash(
        log.actor +
        log.action +
        log.payload +
        log.previousHash
      );

      if (expectedHash !== log.currentHash) {
        return res.json({
          status: "FAIL",
          brokenEntry: log.id
        });
      }
    }

    res.json({
      status: "PASS"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});

router.get("/export", async (req, res) => {
  try {
    const { actor } = req.query;

    const logs = await prisma.log.findMany({
      where: actor ? { actor } : {},
      orderBy: {
        id: "asc"
      }
    });

    res.json({
      count: logs.length,
      logs
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const log = await prisma.log.findUnique({
      where: { id }
    });

    if (!log) {
      return res.status(404).json({
        message: "Log not found"
      });
    }

    const expectedHash = generateHash(
      log.actor +
      log.action +
      log.payload +
      log.previousHash
    );

    const verified = expectedHash === log.currentHash;

    res.json({
      log,
      verified
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});

module.exports = router;