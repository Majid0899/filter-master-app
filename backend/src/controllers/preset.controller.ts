import { Request, Response } from "express";
import Preset from "../models/Preset";

const handleDefaultPreset = async (req: Request, res: Response) => {
  try {
    const preset = await Preset.findOne({ isDefault: true }).lean();
    res.json(preset);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
};

const handleAllPreset = async (req: Request, res: Response) => {
  try {
    const presets = await Preset.find().lean();
    res.json(presets);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
};

const handleSetPreset = async (req: Request, res: Response) => {
  try {
    const { name, filters, logic, isDefault } = req.body;

    if (isDefault) {
      await Preset.updateMany({}, { isDefault: false });
    }

    const preset = new Preset({ name, filters, logic, isDefault });
    await preset.save();

    res.json(preset);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
};

const handleUpdatePreset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, filters, logic, isDefault } = req.body;

    if (isDefault) {
      await Preset.updateMany({}, { isDefault: false });
    }

    const preset = await Preset.findByIdAndUpdate(
      id,
      { name, filters, logic, isDefault },
      { new: true },
    );

    res.json(preset);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
};

const handleDeletePreset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Preset.findByIdAndDelete(id);
    res.json({ message: "Preset deleted" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
};
export {
  handleDefaultPreset,
  handleAllPreset,
  handleSetPreset,
  handleUpdatePreset,
  handleDeletePreset,
};
