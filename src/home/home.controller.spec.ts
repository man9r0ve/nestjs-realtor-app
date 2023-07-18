import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

const mockUserInfo = {
  id: 9,
  name: 'sh.test',
  email: 'test@gmail.com',
  phone: '010 2222 7777',
};

const mockUser = {
  id: 7,
  name: 'SH',
  email: 'mangrove.sh3@gmail.com',
  phone: '010 2222 7777',
};

const mockHome = {
  id: 1,
  address: '김포시 풍무로 50',
  number_of_bedrooms: 3,
  number_of_bathrooms: 2,
  city: '경기도',
  price: 19000,
  landSize: 300,
  property_type: PropertyType.RESIDENTIAL,
};

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: jest.fn().mockReturnValue([]),
            getRealtorByHomeId: jest.fn().mockReturnValue(mockUserInfo),
            updateHomeById: jest.fn().mockReturnValue(mockHome),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });

  describe('getHomes', () => {
    it('should construct filter object correctly', async () => {
      const mockFnGetHomes = jest.fn().mockReturnValue([]);
      jest.spyOn(homeService, 'getHomes').mockImplementation(mockFnGetHomes);

      await controller.getHomes('경기도', '10000');

      expect(mockFnGetHomes).toBeCalledWith({
        city: '경기도',
        price: {
          gte: 10000,
        },
      });
    });
  });

  describe('updatHome', () => {
    const mockUserInfo = {
      name: 'SH',
      id: 80,
      iat: 1,
      exp: 2,
    };

    const mockUpdateHomeParams = {
      address: '김포시 풍무로 50',
      numberOfBathrooms: 3,
      numberOfBedrooms: 2,
      city: '경기도',
      price: 19000,
      landSize: 300,
      propertyType: PropertyType.RESIDENTIAL,
    };

    it("should throw unauthenticated if realtor didn't create home", async () => {
      await expect(
        controller.updateHome(5, mockUpdateHomeParams, mockUserInfo),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should update home if realtor id is valid', async () => {
      const mockFnUpdateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(homeService, 'updateHomeById')
        .mockImplementation(mockFnUpdateHome);

      await controller.updateHome(3, mockUpdateHomeParams, {
        ...mockUserInfo,
        id: 9,
      });

      expect(mockFnUpdateHome).toBeCalled();
    });
  });
});
