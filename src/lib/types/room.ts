export interface PriceIncreaseRange {
  StartDate: string; // YYYY-MM-DD format
  EndDate: string; // YYYY-MM-DD format
  IncreaseValue: number; // Percentage (0-1000)
}

export interface ExcludedDateRange {
  StartDate: string; // YYYY-MM-DD format
  EndDate: string; // YYYY-MM-DD format
}

export interface Room {
  id: number;
  roomName: string;
  roomType: number;
  bedsCount: number;
  sqft: number;
  price: number;
  facilities: number[];
  featureImage: string;
  galleryImages?: string[];
  numberOfRooms?: number;
  priceIncreaseRanges?: PriceIncreaseRange[];
  excludedDateRanges?: ExcludedDateRange[];
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
  Price: string;
  Facilities: string[];
  FeatureImage: File;
  GalleryImages?: File[];
  NumberOfRooms: string;
  PriceIncreaseRanges?: PriceIncreaseRange[];
  ExcludedDateRanges?: ExcludedDateRange[];
}

export interface UpdateRoomRequest {
  RoomName?: string;
  RoomType?: string;
  BedsCount?: string;
  Sqft?: string;
  Price?: string;
  Facilities?: string[];
  FeatureImage?: File;
  GalleryImages?: File[];
  PriceIncreaseRanges?: PriceIncreaseRange[];
  ExcludedDateRanges?: ExcludedDateRange[];
}
