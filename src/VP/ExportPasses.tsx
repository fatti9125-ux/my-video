import React from "react";
import { ExportMode } from "../Thanksgiving3/Kit";
import { VicePresidents1 } from "./VP1";
import { VicePresidents2 } from "./VP2";
import { VicePresidents3 } from "./VP3";

/** After Effects export passes (scripts/ae_export): background plates and the transparent FX overlay. */
export const VP1_BG: React.FC = () => <ExportMode.Provider value="bg"><VicePresidents1 /></ExportMode.Provider>;
export const VP1_FX: React.FC = () => <ExportMode.Provider value="fx"><VicePresidents1 /></ExportMode.Provider>;
export const VP2_BG: React.FC = () => <ExportMode.Provider value="bg"><VicePresidents2 /></ExportMode.Provider>;
export const VP2_FX: React.FC = () => <ExportMode.Provider value="fx"><VicePresidents2 /></ExportMode.Provider>;
export const VP3_BG: React.FC = () => <ExportMode.Provider value="bg"><VicePresidents3 /></ExportMode.Provider>;
export const VP3_FX: React.FC = () => <ExportMode.Provider value="fx"><VicePresidents3 /></ExportMode.Provider>;
