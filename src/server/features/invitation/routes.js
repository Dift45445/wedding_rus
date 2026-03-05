/**
 * Invitation Feature - API Routes
 * Handles fetching invitation data with all related entities
 */

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { uidParamSchema } from "../../schemas.js";
import { getDbClient } from "../../lib/db-client.js";

const invitationRoutes = new Hono();

/**
 * GET /invitation/:uid
 * Get invitation by UID with all related data (agenda, banks)
 */
invitationRoutes.get(
  "/:uid",
  zValidator("param", uidParamSchema),
  async (c) => {
    const { uid } = c.req.valid("param");

    try {
      const pool = await getDbClient(c);

      // Get invitation details
      const invitationResult = await pool.query(
        "SELECT * FROM invitations WHERE uid = $1",
        [uid],
      );

      if (invitationResult.rows.length === 0) {
        return c.json({ success: false, error: "Invitation not found" }, 404);
      }

      const invitation = invitationResult.rows[0];

      // Get agenda items
      const agendaResult = await pool.query(
        "SELECT id, title, date, start_time, end_time, location, address FROM agenda WHERE invitation_uid = $1 ORDER BY order_index, date",
        [uid],
      );

      // Get bank accounts
      const banksResult = await pool.query(
        "SELECT id, bank, account_number, account_name FROM banks WHERE invitation_uid = $1 ORDER BY order_index",
        [uid],
      );

      // Format the response to match frontend config structure
      const data = {
        title: invitation.title,
        description: invitation.description,
        groomName: invitation.groom_name,
        brideName: invitation.bride_name,
        parentGroom: invitation.parent_groom,
        parentBride: invitation.parent_bride,
        date: invitation.wedding_date,
        time: invitation.time,
        location: invitation.location,
        address: invitation.address,
        maps_url: invitation.maps_url,
        maps_embed: invitation.maps_embed,
        ogImage: invitation.og_image,
        favicon: invitation.favicon,
        audio: invitation.audio,
        greetingPrefix: invitation.greeting_prefix,
        invitationText: invitation.invitation_text,
        agenda: agendaResult.rows.map((a) => ({
          title: a.title,
          date: a.date,
          startTime: a.start_time,
          endTime: a.end_time,
          location: a.location,
          address: a.address,
        })),
        banks: banksResult.rows.map((b) => ({
          bank: b.bank,
          accountNumber: b.account_number,
          accountName: b.account_name,
        })),
      };

      return c.json({ success: true, data });
    } catch (error) {
      console.error("Error fetching invitation:", error);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  },
);

/**
 * PUT /invitation/:uid/program
 * Update wedding program
 */
invitationRoutes.put(
  "/:uid/program",
  zValidator("param", uidParamSchema),
  async (c) => {
    const { uid } = c.req.valid("param");
    const { program } = await c.req.json();

    try {
      const pool = await getDbClient(c);

      // Verify invitation exists
      const check = await pool.query("SELECT id FROM invitations WHERE uid = $1", [uid]);
      if (check.rows.length === 0) {
        return c.json({ success: false, error: "Invitation not found" }, 404);
      }

      // Update program
      await pool.query(
        "UPDATE invitations SET program = $1 WHERE uid = $2",
        [JSON.stringify(program), uid]
      );

      return c.json({ success: true });
    } catch (error) {
      console.error("Error updating program:", error);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

/**
 * PUT /invitation/:uid/config
 * Update wedding config (greeting prefix, invitation text)
 */
invitationRoutes.put(
  "/:uid/config",
  zValidator("param", uidParamSchema),
  async (c) => {
    const { uid } = c.req.valid("param");
    const { greetingPrefix, invitationText } = await c.req.json();

    try {
      const pool = await getDbClient(c);

      // Verify invitation exists
      const check = await pool.query("SELECT id FROM invitations WHERE uid = $1", [uid]);
      if (check.rows.length === 0) {
        return c.json({ success: false, error: "Invitation not found" }, 404);
      }

      // Update config
      await pool.query(
        "UPDATE invitations SET greeting_prefix = $1, invitation_text = $2 WHERE uid = $3",
        [greetingPrefix, invitationText, uid]
      );

      return c.json({ success: true });
    } catch (error) {
      console.error("Error updating config:", error);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

export default invitationRoutes;
