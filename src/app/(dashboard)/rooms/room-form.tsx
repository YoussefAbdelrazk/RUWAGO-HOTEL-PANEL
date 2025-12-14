'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFacilities } from '@/hooks/use-facilities';
import { useCreateRoom, useRoom, useUpdateRoom } from '@/hooks/use-rooms';
import {
  createRoomSchema,
  updateRoomSchema,
  type CreateRoomFormData,
  type UpdateRoomFormData,
} from '@/lib/schemes/room';
import { CreateRoomRequest, UpdateRoomRequest } from '@/lib/types/room';
import { getImageUrl } from '@/lib/utils/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface RoomFormProps {
  roomId?: number;
  onSuccess?: () => void;
}

// Fake room type data
const ROOM_TYPES = [
  { value: '1', label: 'Suite' },
  { value: '2', label: 'Mini Suite' },
  { value: '3', label: 'Deluxe' },
  { value: '4', label: 'Standard' },
  { value: '5', label: 'Executive' },
  { value: '6', label: 'Presidential' },
  { value: '7', label: 'Family' },
  { value: '8', label: 'Studio' },
];

export function RoomForm({ roomId, onSuccess }: RoomFormProps) {
  const isEdit = !!roomId;
  const { data: room, isLoading: roomLoading } = useRoom(roomId || null);
  const { data: facilities = [], isLoading: facilitiesLoading } = useFacilities();
  const createRoomMutation = useCreateRoom();
  const updateRoomMutation = useUpdateRoom();

  const createForm = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      RoomName: '',
      RoomType: '',
      BedsCount: '',
      Sqft: '',
      Facilities: [],
      FeatureImage: undefined,
      GalleryImages: [],
      NumberOfRooms: '0',
      PriceIncreaseRanges: [],
      ExcludedDateRanges: [],
    },
  });

  const updateForm = useForm<UpdateRoomFormData>({
    resolver: zodResolver(updateRoomSchema),
    defaultValues: {
      RoomName: '',
      RoomType: '',
      BedsCount: '',
      Sqft: '',
      Facilities: [],
      FeatureImage: undefined,
      GalleryImages: [],
      PriceIncreaseRanges: [],
      ExcludedDateRanges: [],
    },
  });

  const [featureImagePreview, setFeatureImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Load room data for editing
  useEffect(() => {
    if (room && isEdit) {
      updateForm.reset({
        RoomName: room.roomName,
        RoomType: room.roomType.toString(),
        BedsCount: room.bedsCount.toString(),
        Sqft: room.sqft.toString(),
        Facilities: room.facilities.map(f => f.toString()),
        FeatureImage: undefined,
        GalleryImages: [],
      });
      if (room.featureImage) {
        setFeatureImagePreview(room.featureImage);
      }
      if (room.galleryImages) {
        setGalleryPreviews(room.galleryImages);
      }
    }
  }, [room, isEdit, updateForm]);

  const facilityOptions =
    facilities.map(facility => ({
      label: facility.title,
      value: facility.id.toString(),
    })) || [];

  const onSubmit = async (data: CreateRoomFormData | UpdateRoomFormData) => {
    try {
      if (isEdit && roomId) {
        const updateData: UpdateRoomRequest = {};
        const formData = data as UpdateRoomFormData;
        if (formData.RoomName) updateData.RoomName = formData.RoomName;
        if (formData.RoomType) updateData.RoomType = formData.RoomType;
        if (formData.BedsCount) updateData.BedsCount = formData.BedsCount;
        if (formData.Sqft) updateData.Sqft = formData.Sqft;
        if (formData.Facilities && formData.Facilities.length > 0) {
          updateData.Facilities = formData.Facilities;
        }
        if (formData.FeatureImage instanceof File) {
          updateData.FeatureImage = formData.FeatureImage;
        }
        if (formData.GalleryImages && formData.GalleryImages.length > 0) {
          updateData.GalleryImages = formData.GalleryImages;
        }
        if (formData.PriceIncreaseRanges && formData.PriceIncreaseRanges.length > 0) {
          updateData.PriceIncreaseRanges = formData.PriceIncreaseRanges;
        }
        if (formData.ExcludedDateRanges && formData.ExcludedDateRanges.length > 0) {
          updateData.ExcludedDateRanges = formData.ExcludedDateRanges;
        }
        await updateRoomMutation.mutateAsync({
          roomId,
          data: updateData,
        });
        toast.success('Room updated successfully');
      } else {
        const formData = data as CreateRoomFormData;
        const createData: CreateRoomRequest = {
          RoomName: formData.RoomName,
          RoomType: formData.RoomType,
          BedsCount: formData.BedsCount,
          Sqft: formData.Sqft,
          Facilities: formData.Facilities,
          FeatureImage: formData.FeatureImage as File,
          GalleryImages: formData.GalleryImages,
          NumberOfRooms: formData.NumberOfRooms,
          PriceIncreaseRanges: formData.PriceIncreaseRanges,
          ExcludedDateRanges: formData.ExcludedDateRanges,
        };
        await createRoomMutation.mutateAsync(createData);
        toast.success('Room created successfully');
      }
      onSuccess?.();
    } catch {
      toast.error(isEdit ? 'Failed to update room' : 'Failed to create room');
    }
  };

  const handleFeatureImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isEdit) {
        updateForm.setValue('FeatureImage', file);
      } else {
        createForm.setValue('FeatureImage', file);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeatureImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      if (isEdit) {
        const currentImages = updateForm.getValues('GalleryImages') || [];
        updateForm.setValue('GalleryImages', [...currentImages, ...files]);
      } else {
        const currentImages = createForm.getValues('GalleryImages') || [];
        createForm.setValue('GalleryImages', [...currentImages, ...files]);
      }
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    if (isEdit) {
      const currentImages = updateForm.getValues('GalleryImages') || [];
      const newImages = currentImages.filter((_, i) => i !== index);
      updateForm.setValue('GalleryImages', newImages);
    } else {
      const currentImages = createForm.getValues('GalleryImages') || [];
      const newImages = currentImages.filter((_, i) => i !== index);
      createForm.setValue('GalleryImages', newImages);
    }
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  if (isEdit && roomLoading) {
    return <div className='py-8 text-center text-muted-foreground'>Loading room data...</div>;
  }

  // Render form fields JSX
  const renderFormFields = (
    form:
      | ReturnType<typeof useForm<CreateRoomFormData>>
      | ReturnType<typeof useForm<UpdateRoomFormData>>,
    formIsEdit: boolean,
  ) => (
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <FormField
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={form.control as any}
          name='RoomName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name *</FormLabel>
              <FormControl>
                <Input placeholder='Deluxe Suite' {...field} />
              </FormControl>
              <FormDescription>Room name (required, 1-500 characters)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={form.control as any}
          name='RoomType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select room type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ROOM_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the room type (required)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <FormField
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={form.control as any}
          name='BedsCount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beds Count *</FormLabel>
              <FormControl>
                <Input type='number' placeholder='2' min={1} max={100} {...field} />
              </FormControl>
              <FormDescription>Number of beds (required, min: 1, max: 100)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={form.control as any}
          name='Sqft'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Square Footage *</FormLabel>
              <FormControl>
                <Input type='number' placeholder='500' min={5} max={10000} {...field} />
              </FormControl>
              <FormDescription>Square footage (required, min: 5, max: 10000)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {!formIsEdit && (
        <FormField
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={form.control as any}
          name='NumberOfRooms'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Rooms *</FormLabel>
              <FormControl>
                <Input type='number' placeholder='5' min={1} {...field} />
              </FormControl>
              <FormDescription>Number of identical rooms to create (required)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        control={form.control as any}
        name='Facilities'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facilities *</FormLabel>
            <FormControl>
              <MultiSelect
                options={facilityOptions}
                selected={field.value}
                onChange={field.onChange}
                placeholder={facilitiesLoading ? 'Loading facilities...' : 'Select facilities'}
              />
            </FormControl>
            <FormDescription>Select at least one facility</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='space-y-2'>
        <Label>Feature Image *</Label>
        <div className='space-y-4'>
          {featureImagePreview && (
            <div className='relative h-48 w-full overflow-hidden rounded-md border'>
              <Image
                src={
                  featureImagePreview.startsWith('data:')
                    ? featureImagePreview
                    : getImageUrl(featureImagePreview)
                }
                alt='Feature preview'
                fill
                className='object-cover'
              />
            </div>
          )}
          <Input
            type='file'
            accept='image/*'
            onChange={handleFeatureImageChange}
            className='cursor-pointer'
          />
          <p className='text-sm text-muted-foreground'>
            Feature image file {formIsEdit ? '(optional, max 10MB)' : '(required, max 10MB)'}
          </p>
        </div>
      </div>

      <div className='space-y-2'>
        <Label>Gallery Images</Label>
        <div className='space-y-4'>
          {galleryPreviews.length > 0 && (
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
              {galleryPreviews.map((preview, index) => (
                <div key={index} className='relative h-32 w-full overflow-hidden rounded-md border'>
                  <Image
                    src={preview.startsWith('data:') ? preview : getImageUrl(preview)}
                    alt={`Gallery ${index + 1}`}
                    className='h-full w-full object-cover'
                    width={128}
                    height={128}
                  />
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute right-2 top-2 h-6 w-6'
                    onClick={() => removeGalleryImage(index)}
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Input
            type='file'
            accept='image/*'
            multiple
            onChange={handleGalleryImagesChange}
            className='cursor-pointer'
          />
          <p className='text-sm text-muted-foreground'>
            Gallery image files (optional, multiple files allowed, max 10MB each)
          </p>
        </div>
      </div>

      {/* Price Increase Ranges */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Label className='text-base font-semibold'>Price Increase Ranges</Label>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const formValues = form.getValues() as any;
              const currentRanges = (formValues.PriceIncreaseRanges || []) as Array<{
                StartDate: string;
                EndDate: string;
                IncreaseValue: number;
              }>;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (form.setValue as any)('PriceIncreaseRanges', [
                ...currentRanges,
                { StartDate: '', EndDate: '', IncreaseValue: 0 },
              ]);
            }}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Range
          </Button>
        </div>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {((form.watch as any)('PriceIncreaseRanges') || []).map(
          (range: { StartDate: string; EndDate: string; IncreaseValue: number }, index: number) => (
            <div key={index} className='rounded-lg border p-4 space-y-4'>
              <div className='flex items-center justify-between'>
                <Label className='text-sm font-medium'>Price Increase Range {index + 1}</Label>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const formValues = form.getValues() as any;
                    const currentRanges = (formValues.PriceIncreaseRanges || []) as Array<{
                      StartDate: string;
                      EndDate: string;
                      IncreaseValue: number;
                    }>;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (form.setValue as any)(
                      'PriceIncreaseRanges',
                      currentRanges.filter((_, i) => i !== index),
                    );
                  }}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={form.control as any}
                  name={`PriceIncreaseRanges.${index}.StartDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={form.control as any}
                  name={`PriceIncreaseRanges.${index}.EndDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={form.control as any}
                  name={`PriceIncreaseRanges.${index}.IncreaseValue`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Increase Value (%)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={0}
                          max={1000}
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ),
        )}
      </div>

      {/* Excluded Date Ranges */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Label className='text-base font-semibold'>Excluded Date Ranges</Label>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const formValues = form.getValues() as any;
              const currentRanges = (formValues.ExcludedDateRanges || []) as Array<{
                StartDate: string;
                EndDate: string;
              }>;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (form.setValue as any)('ExcludedDateRanges', [
                ...currentRanges,
                { StartDate: '', EndDate: '' },
              ]);
            }}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Range
          </Button>
        </div>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {((form.watch as any)('ExcludedDateRanges') || []).map(
          (range: { StartDate: string; EndDate: string }, index: number) => (
            <div key={index} className='rounded-lg border p-4 space-y-4'>
              <div className='flex items-center justify-between'>
                <Label className='text-sm font-medium'>Excluded Date Range {index + 1}</Label>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const formValues = form.getValues() as any;
                    const currentRanges = (formValues.ExcludedDateRanges || []) as Array<{
                      StartDate: string;
                      EndDate: string;
                    }>;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (form.setValue as any)(
                      'ExcludedDateRanges',
                      currentRanges.filter((_, i) => i !== index),
                    );
                  }}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={form.control as any}
                  name={`ExcludedDateRanges.${index}.StartDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={form.control as any}
                  name={`ExcludedDateRanges.${index}.EndDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ),
        )}
      </div>

      <div className='flex justify-end gap-2'>
        <Button
          type='button'
          variant='outline'
          onClick={() => {
            form.reset({
              RoomName: '',
              RoomType: '',
              BedsCount: '',
              Sqft: '',
              Facilities: [],
              FeatureImage: undefined,
              GalleryImages: [],
              NumberOfRooms: formIsEdit ? undefined : '0',
              PriceIncreaseRanges: [],
              ExcludedDateRanges: [],
            });
            setFeatureImagePreview(null);
            setGalleryPreviews([]);
          }}
        >
          Reset
        </Button>
        <Button
          type='submit'
          disabled={createRoomMutation.isPending || updateRoomMutation.isPending}
        >
          {createRoomMutation.isPending || updateRoomMutation.isPending
            ? 'Saving...'
            : formIsEdit
            ? 'Update Room'
            : 'Create Room'}
        </Button>
      </div>
    </>
  );

  if (isEdit) {
    return (
      <Form {...updateForm}>
        <form onSubmit={updateForm.handleSubmit(onSubmit)} className='space-y-6'>
          {renderFormFields(updateForm, true)}
        </form>
      </Form>
    );
  }

  return (
    <Form {...createForm}>
      <form onSubmit={createForm.handleSubmit(onSubmit)} className='space-y-6'>
        {renderFormFields(createForm, false)}
      </form>
    </Form>
  );
}
