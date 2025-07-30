import { z } from 'zod';

export const genericSlicerSchema = z.object({
  first_layer_bed_temp: z.number().optional(),
  first_layer_nozzle_temp: z.number().optional(),
  bed_temp: z.number().optional(),
  nozzle_temp: z.number().optional(),
});

// For "specific slicer settings"
export const prusaSlicerSettingsSchema = z.object({
  prusa_profile_path: z.string().optional(),
  prusa_overrides: z
    .object({
      first_layer_bed_temp: z.number().optional(),
      first_layer_nozzle_temp: z.number().optional(),
      bed_temp: z.number().optional(),
      nozzle_temp: z.number().optional(),
    })
    .optional(),
});

export const bambuStudioSlicerSettingsSchema = z.object({
  bambu_profile_path: z.string().optional(),
  bambu_overrides: z.object({
    first_layer_bed_temp: z.number().optional(),
    first_layer_nozzle_temp: z.number().optional(),
    bed_temp: z.number().optional(),
    nozzle_temp: z.number().optional(),
  }),
});

export const orcaSlicerSettingsSchema = z.object({
  orca_profile_path: z.string().optional(),
  orca_overrides: z.object({
    first_layer_bed_temp: z.number().optional(),
    first_layer_nozzle_temp: z.number().optional(),
    bed_temp: z.number().optional(),
    nozzle_temp: z.number().optional(),
  }),
});

export const curaSlicerSettingsSchema = z.object({
  cura_profile_path: z.string().optional(),
  cura_overrides: z.object({
    first_layer_bed_temp: z.number().optional(),
    first_layer_nozzle_temp: z.number().optional(),
    bed_temp: z.number().optional(),
    nozzle_temp: z.number().optional(),
  }),
});

export const slicerSettingsSchema = z.object({
  generic: genericSlicerSchema,
  prusa: prusaSlicerSettingsSchema,
  bambus: bambuStudioSlicerSettingsSchema,
  orca: orcaSlicerSettingsSchema,
  cura: curaSlicerSettingsSchema,
});

export const filamentMaterialSchema = z
  .object({
    material: z.string(),
  })
  .merge(slicerSettingsSchema);
