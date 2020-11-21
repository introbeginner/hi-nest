import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);

    service.create({
      title:"Test Movie",
      genres: ['test'],
      year:2000,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () =>{
    it('Should return an array', () =>{
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () =>{
    it("should return a movie", () => {
        service.create({
          title:"Test Movie",
          genres: ['test'],
          year:2000,
        });
        const movie =service.getOne(1);
        expect(movie).toBeDefined();
        expect(movie.id).toEqual(1);
    });
    it("should throw 404 error", () =>{
      try{
        service.getOne(999);
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual("Movie with ID ${id}999 notFound");
      }
    });
  });

  describe("deleteOne", ()=>{
    it("deletes a movie", ()=>{
      service.create({
        title:"Test Movie",
        genres: ['test'],
        year:2000,
      });
      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;
      expect(afterDelete).toEqual(beforeDelete -1);
    });
    it("should return a 404", () => {
      try{
        service.deleteOne(999);
      }catch (e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    })
  });

  describe("create", () =>{
    it("Should create a movie", () =>{
      const beforeCreate = service.getAll().length;
      service.create({
        title:"Test Movie",
        genres: ['test'],
        year:2000,
      });
      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    })
  });

  describe("update", () =>{
    it("should update a movie", () =>{
      service.update(1,{title:"Updated Test"});
      const movie = service.getOne(1);
      expect(movie.title).toEqual("Updated Test");
    })
    it("Can Not Update return a 404", () => {
      try{
        service.update(999, {});
      }catch (e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    })
  })

});
