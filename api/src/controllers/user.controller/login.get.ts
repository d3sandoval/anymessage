/**
 * Copyright (c) AnyMessage.io. All rights reserved. http://www.anymessage.io
 *
 * The software in this package is published under the terms of the CPAL v1.0
 * license, a copy of which has been included with this distribution in the
 * LICENSE.md file.
 */
import { Request, Response } from "express";
import { TeamModel, UserModel } from "../../models";

export const getLogin = async (req: Request, res: Response) => {
    try {
        const user = new UserModel(req.app.get("db"), req.user.email);
        await user.init();
        if (user.exists()) {
            // update stored metadata
            await user.updateMetadata(req.user);
            // get team_id to return it
            let result: {};
            const teamId = user.getTeamId();
            if (teamId) {
                const team = new TeamModel(req.app.get("db"), teamId);
                await team.init();

                const subdomain = team.getSubdomain();
                if (subdomain) {
                    result = {
                        redirectURI: `//${subdomain}.${process.env.UI_HOSTNAME}/messages`,
                        teamURL: subdomain,
                    };
                }
            }
            res.status(200);
            res.json(result || { redirectURI: "/setup" });
        } else {
            const newUser = await user.create(req.user);
            if (newUser) {
                res.status(200);
                res.json({ redirectURI: "/setup" });
            } else {
                throw new Error(newUser as unknown as string); // unknown error, throw the object
            }
        }
    } catch (e) {
        console.error(e);
        res.status(e.status || 500);
        (e.status && e.message) ? res.json({ error: e.message }) : res.send();
    }
}