import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { filamentSchema } from '$lib/validation/filament-schema';
import { filamentVariantSchema } from '$lib/validation/filament-variant-schema';
import { createColorFiles, removeUndefined, updateFilament } from '$lib/server/helpers';
import { setFlash } from 'sveltekit-flash-message/server';
import { refreshDatabase } from '$lib/dataCacher';
import { stripOfIllegalChars } from '$lib/globalHelpers';

export const load: PageServerLoad = async ({ params, parent }) => {
  const { brand, material, filament } = params;
  const { filamentData } = await parent();

  const normalizedBrand = brand.trim().toLowerCase().replace(/\s+/g, '');
  const normalizedMaterial = material.trim().toLowerCase().replace(/\s+/g, '');
  const normalizedFilament = filament.trim().toLowerCase().replace(/\s+/g, '');

  const brandKey = Object.keys(filamentData.brands).find(
    (key) => key.toLowerCase().replace(/\s+/g, '') === normalizedBrand,
  );
  if (!brandKey) throw error(404, 'Brand not found');
  const brandData = filamentData.brands[brandKey];

  const materialKey = Object.keys(brandData.materials).find(
    (key) => key.toLowerCase().replace(/\s+/g, '') === normalizedMaterial,
  );
  if (!materialKey) throw error(404, 'Material not found');
  const materialData = brandData.materials[materialKey];

  const filamentKey = Object.keys(materialData.filaments).find(
    (key) => key.toLowerCase().replace(/\s+/g, '') === normalizedFilament,
  );
  if (!filamentKey) throw error(404, 'Filament not found');
  const filamentDataObj = materialData.filaments[filamentKey];

  const filamentForm = await superValidate(filamentDataObj, zod(filamentSchema));
  const filamentVariantForm = await superValidate(zod(filamentVariantSchema));

  return {
    brandData,
    materialData,
    filamentForm,
    filamentVariantForm,
    filamentData: filamentDataObj,
  };
};

export const actions = {
  filament: async ({ request, params, cookies }) => {
    const form = await superValidate(request, zod(filamentSchema));
    const { brand, material, filament } = params;

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const filteredFilament = removeUndefined(form.data);
      await updateFilament(brand, material, filament, filteredFilament);
      await refreshDatabase();
    } catch (error) {
      console.error('Failed to update filament:', error);
      setFlash({ type: 'error', message: 'Failed to update filament. Please try again.' }, cookies);
      return fail(500, { form });
    }

    setFlash({ type: 'success', message: 'Filament updated successfully!' }, cookies);
    throw redirect(303, `/Brand/${stripOfIllegalChars(brand)}/${material}/${form.data.name}`);
  },
  variant: async ({ request, params, cookies }) => {
    let data = await request.formData();
    const form = await superValidate(data, zod(filamentVariantSchema));
    const { brand, material, filament } = params;

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      let filteredData = removeUndefined(form.data);

      filteredData['brandName'] = brand;
      filteredData['materialName'] = material;
      filteredData['filamentName'] = filament;
      filteredData['color_name'] = filteredData.color_name;

      await createColorFiles(filteredData);
      await refreshDatabase();
    } catch (error) {
      console.error('Failed to update color:', error);
      setFlash({ type: 'error', message: 'Failed to update color. Please try again.' }, cookies);
      return fail(500, { form });
    }

    setFlash({ type: 'success', message: 'Color updated successfully!' }, cookies);
    throw redirect(303, `/Brand/${stripOfIllegalChars(brand)}/${material}/${filament}/${form.data.color_name}`);
  },
};
