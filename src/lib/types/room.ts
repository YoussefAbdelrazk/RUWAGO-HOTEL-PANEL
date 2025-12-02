export interface Room {
  id: number;
  roomName: string;
  roomType: number;
  bedsCount: number;
  sqft: number;
  facilities: number[];
  featureImage: string;
  galleryImages?: string[];
  numberOfRooms?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomsResponse {
  rooms: Room[];
}

export interface RoomResponse {
  room: Room;
}

export interface CreateRoomRequest {
  RoomName: string;
  RoomType: string;
  BedsCount: string;
  Sqft: string;
  Facilities: string[];
  FeatureImage: File;
  GalleryImages?: File[];
  NumberOfRooms: string;
}

export interface UpdateRoomRequest {
  RoomName?: string;
  RoomType?: string;
  BedsCount?: string;
  Sqft?: string;
  Facilities?: string[];
  FeatureImage?: File;
  GalleryImages?: File[];
}

