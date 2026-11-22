import React from "react";
import { ExportMode } from "../Thanksgiving3/Kit";
import { VicePresidents1 } from "./VP1";

/** After Effects export passes (scripts/ae_export): background plates and the transparent FX overlay. */
export const VP1_BG: React.FC = () => <ExportMode.Provider value="bg"><VicePresidents1 /></ExportMode.Provider>;
export const VP1_FX: React.FC = () => <ExportMode.Provider value="fx"><VicePresidents1 /></ExportMode.Provider>;
