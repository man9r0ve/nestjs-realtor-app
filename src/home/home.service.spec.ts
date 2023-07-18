import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '.prisma/client';
import { HomeService, homeSelect } from './home.service';
import { NotFoundException } from '@nestjs/common';

const mockGetHomes = [
  {
    id: 1,
    address: '김포시 풍무로 50',
    numberOfBedrooms: 3,
    numberOfBathrooms: 2,
    city: '경기도',
    price: 19000,
    landSize: 300,
    propertyType: PropertyType.RESIDENTIAL,
    images: [
      {
        url: 'src1',
      },
    ],
  },
];

const mockHome = {
  id: 1,
  address: '김포시 풍무로 50',
  number_of_bedrooms: 3,
  number_of_bathrooms: 2,
  city: '경기도',
  price: 19000,
  landSize: 300,
  property_type: PropertyType.RESIDENTIAL,
  images: [
    {
      url: 'src1',
    },
  ],
};

const mockImages = [
  {
    id: 1,
    url: 'src1',
  },
  {
    id: 2,
    url: 'src2',
  },
];

const mockCreateHome = [];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockGetHomes),
              create: jest.fn().mockReturnValue(mockHome),
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImages),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  describe('getHomes', () => {
    const filters = {
      city: '경기도',
      price: {
        gte: 10000,
        lte: 30000,
      },
      propertyType: PropertyType.RESIDENTIAL,
    };

    it('should call prisma home.findMany with correct params', async () => {
      const mockFnPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockFnPrismaFindManyHomes);

      await service.getHomes(filters);

      expect(mockFnPrismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: filters,
      });
    });

    it('should throw not found exception if not homes are found', async () => {
      const mockFnPrismaFindManyHomes = jest.fn().mockReturnValue([]);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockFnPrismaFindManyHomes);

      await expect(service.getHomes(filters)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createHome', () => {
    const mockCreateHome = {
      address: '김포시 풍무로 50',
      numberOfBathrooms: 3,
      numberOfBedrooms: 2,
      city: '경기도',
      price: 19000,
      landSize: 300,
      propertyType: PropertyType.RESIDENTIAL,
      images: [
        {
          url: 'src1',
        },
      ],
    };
    it('should call prisma home.create with the correct payload', async () => {
      const mockFnCreateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'create')
        .mockImplementation(mockFnCreateHome);

      await service.createHome(mockCreateHome, 5);

      expect(mockFnCreateHome).toBeCalledWith({
        data: {
          address: mockCreateHome.address,
          number_of_bathrooms: mockCreateHome.numberOfBathrooms,
          number_of_bedrooms: mockCreateHome.numberOfBedrooms,
          city: mockCreateHome.city,
          land_size: mockCreateHome.landSize,
          price: mockCreateHome.price,
          property_type: mockCreateHome.propertyType,
          realtor_id: 5,
        },
      });
    });

    it('should call prisma image.creatMany with the correct payload', async () => {
      const mockFnCreateManyImage = jest.fn().mockReturnValue(mockImages);

      jest
        .spyOn(prismaService.image, 'createMany')
        .mockImplementation(mockFnCreateManyImage);

      await service.createHome(mockCreateHome, 5);

      expect(mockFnCreateManyImage).toBeCalledWith({
        data: [
          {
            url: 'src1',
            home_id: 1,
          },
        ],
      });
    });
  });
});
