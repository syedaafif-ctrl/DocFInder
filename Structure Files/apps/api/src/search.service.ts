// apps/api/src/modules/search/search.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService as ESService } from '@nestjs/elasticsearch';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly DOCTORS_INDEX = 'swastha_doctors';
  private readonly HOSPITALS_INDEX = 'swastha_hospitals';

  constructor(
    private readonly esService: ESService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createIndices();
  }

  // ============================================================
  // INDEX MANAGEMENT
  // ============================================================

  private async createIndices() {
    await this.createDoctorIndex();
    await this.createHospitalIndex();
  }

  private async createDoctorIndex() {
    const indexExists = await this.esService.indices.exists({ index: this.DOCTORS_INDEX });
    if (indexExists) return;

    await this.esService.indices.create({
      index: this.DOCTORS_INDEX,
      body: {
        settings: {
          number_of_shards: 2,
          number_of_replicas: 1,
          analysis: {
            analyzer: {
              bangladeshi_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'asciifolding', 'stop'],
              },
              bengali_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase'],
              },
            },
          },
        },
        mappings: {
          properties: {
            id: { type: 'keyword' },
            slug: { type: 'keyword' },
            name: {
              type: 'text',
              analyzer: 'bangladeshi_analyzer',
              fields: { keyword: { type: 'keyword' }, suggest: { type: 'search_as_you_type' } },
            },
            nameBn: {
              type: 'text',
              analyzer: 'bengali_analyzer',
              fields: { keyword: { type: 'keyword' } },
            },
            title: { type: 'keyword' },
            gender: { type: 'keyword' },
            photo: { type: 'keyword', index: false },
            about: { type: 'text', analyzer: 'bangladeshi_analyzer' },
            bmdcNumber: { type: 'keyword' },
            experience: { type: 'integer' },
            consultationFee: { type: 'integer' },
            rating: { type: 'float' },
            reviewCount: { type: 'integer' },
            totalAppointments: { type: 'integer' },
            isVerified: { type: 'boolean' },
            isFeatured: { type: 'boolean' },
            isAvailableOnline: { type: 'boolean' },
            sponsoredRank: { type: 'integer' },
            languages: { type: 'keyword' },
            status: { type: 'keyword' },
            specialties: {
              type: 'nested',
              properties: {
                id: { type: 'keyword' },
                name: { type: 'text', analyzer: 'bangladeshi_analyzer', fields: { keyword: { type: 'keyword' } } },
                nameBn: { type: 'text', analyzer: 'bengali_analyzer' },
                slug: { type: 'keyword' },
                isPrimary: { type: 'boolean' },
              },
            },
            qualifications: {
              type: 'nested',
              properties: {
                degree: { type: 'text', fields: { keyword: { type: 'keyword' } } },
                institution: { type: 'text' },
                year: { type: 'integer' },
              },
            },
            chambers: {
              type: 'nested',
              properties: {
                id: { type: 'keyword' },
                name: { type: 'text' },
                areaId: { type: 'keyword' },
                areaName: { type: 'keyword' },
                location: { type: 'geo_point' },
              },
            },
            district: {
              properties: {
                id: { type: 'keyword' },
                name: { type: 'keyword' },
                nameBn: { type: 'keyword' },
                slug: { type: 'keyword' },
              },
            },
            hospitals: {
              type: 'nested',
              properties: {
                id: { type: 'keyword' },
                name: { type: 'text', fields: { keyword: { type: 'keyword' } } },
                slug: { type: 'keyword' },
              },
            },
            createdAt: { type: 'date' },
          },
        },
      },
    });

    this.logger.log(`Created Elasticsearch index: ${this.DOCTORS_INDEX}`);
  }

  private async createHospitalIndex() {
    const indexExists = await this.esService.indices.exists({ index: this.HOSPITALS_INDEX });
    if (indexExists) return;

    await this.esService.indices.create({
      index: this.HOSPITALS_INDEX,
      body: {
        settings: { number_of_shards: 1, number_of_replicas: 1 },
        mappings: {
          properties: {
            id: { type: 'keyword' },
            slug: { type: 'keyword' },
            name: { type: 'text', fields: { keyword: { type: 'keyword' }, suggest: { type: 'search_as_you_type' } } },
            nameBn: { type: 'text' },
            type: { type: 'keyword' },
            description: { type: 'text' },
            address: { type: 'text' },
            districtId: { type: 'keyword' },
            districtName: { type: 'keyword' },
            location: { type: 'geo_point' },
            isVerified: { type: 'boolean' },
            isFeatured: { type: 'boolean' },
            isEmergency: { type: 'boolean' },
            rating: { type: 'float' },
            reviewCount: { type: 'integer' },
          },
        },
      },
    });

    this.logger.log(`Created Elasticsearch index: ${this.HOSPITALS_INDEX}`);
  }

  // ============================================================
  // INDEXING
  // ============================================================

  async indexDoctor(doctor: any) {
    try {
      const doc = {
        id: doctor.id,
        slug: doctor.slug,
        name: doctor.name,
        nameBn: doctor.nameBn,
        title: doctor.title,
        gender: doctor.gender,
        photo: doctor.photo,
        about: doctor.about,
        bmdcNumber: doctor.bmdcNumber,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        rating: doctor.rating,
        reviewCount: doctor.reviewCount,
        totalAppointments: doctor.totalAppointments,
        isVerified: doctor.isVerified,
        isFeatured: doctor.isFeatured,
        isAvailableOnline: doctor.isAvailableOnline,
        sponsoredRank: doctor.sponsoredRank,
        languages: doctor.languages,
        status: doctor.status,
        specialties: (doctor.specialties || []).map((s: any) => ({
          id: s.specialty?.id || s.specialtyId,
          name: s.specialty?.name,
          nameBn: s.specialty?.nameBn,
          slug: s.specialty?.slug,
          isPrimary: s.isPrimary,
        })),
        qualifications: (doctor.qualifications || []).map((q: any) => ({
          degree: q.degree,
          institution: q.institution,
          year: q.year,
        })),
        chambers: (doctor.chambers || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          areaId: c.areaId,
          areaName: c.area?.name,
          location: c.latitude && c.longitude ? { lat: c.latitude, lon: c.longitude } : undefined,
        })),
        district: doctor.district
          ? { id: doctor.district.id, name: doctor.district.name, nameBn: doctor.district.nameBn, slug: doctor.district.slug }
          : undefined,
        hospitals: (doctor.hospitals || []).map((h: any) => ({
          id: h.hospital?.id || h.hospitalId,
          name: h.hospital?.name,
          slug: h.hospital?.slug,
        })),
        createdAt: doctor.createdAt,
      };

      await this.esService.index({
        index: this.DOCTORS_INDEX,
        id: doctor.id,
        body: doc,
      });
    } catch (error: any) {
      this.logger.error(`Failed to index doctor ${doctor.id}: ${error.message}`);
      throw error;
    }
  }

  async indexHospital(hospital: any) {
    try {
      await this.esService.index({
        index: this.HOSPITALS_INDEX,
        id: hospital.id,
        body: {
          id: hospital.id,
          slug: hospital.slug,
          name: hospital.name,
          nameBn: hospital.nameBn,
          type: hospital.type,
          description: hospital.description,
          address: hospital.address,
          districtId: hospital.districtId,
          districtName: hospital.district?.name,
          location: hospital.latitude && hospital.longitude
            ? { lat: hospital.latitude, lon: hospital.longitude }
            : undefined,
          isVerified: hospital.isVerified,
          isFeatured: hospital.isFeatured,
          isEmergency: hospital.isEmergency,
          rating: hospital.rating,
          reviewCount: hospital.reviewCount,
        },
      });
    } catch (error: any) {
      this.logger.error(`Failed to index hospital ${hospital.id}: ${error.message}`);
    }
  }

  async removeDoctor(doctorId: string) {
    await this.esService.delete({ index: this.DOCTORS_INDEX, id: doctorId }).catch(() => {});
  }

  // ============================================================
  // SEARCH
  // ============================================================

  async searchDoctors(params: {
    query?: string;
    specialtyId?: string;
    specialtySlug?: string;
    districtId?: string;
    areaId?: string;
    gender?: string;
    minFee?: number;
    maxFee?: number;
    minExperience?: number;
    maxExperience?: number;
    language?: string;
    isAvailableOnline?: boolean;
    isFeatured?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
    lat?: number;
    lon?: number;
    radiusKm?: number;
  }) {
    const { query, page = 1, limit = 20, sortBy = 'relevance', lat, lon, radiusKm = 5 } = params;
    const from = (page - 1) * limit;

    const must: any[] = [{ term: { status: 'ACTIVE' } }];
    const filter: any[] = [];
    const should: any[] = [];

    // Full-text search
    if (query) {
      should.push(
        { multi_match: { query, fields: ['name^4', 'nameBn^4', 'name.suggest^3', 'about^1'], type: 'best_fields', fuzziness: 'AUTO' } },
        { nested: { path: 'specialties', query: { multi_match: { query, fields: ['specialties.name^3', 'specialties.nameBn^2'], fuzziness: 'AUTO' } } } },
        { nested: { path: 'qualifications', query: { multi_match: { query, fields: ['qualifications.degree^2', 'qualifications.institution'] } } } },
        { nested: { path: 'hospitals', query: { match: { 'hospitals.name': query } } } },
      );
    }

    // Filters
    if (params.specialtyId) {
      filter.push({ nested: { path: 'specialties', query: { term: { 'specialties.id': params.specialtyId } } } });
    }
    if (params.specialtySlug) {
      filter.push({ nested: { path: 'specialties', query: { term: { 'specialties.slug': params.specialtySlug } } } });
    }
    if (params.districtId) filter.push({ term: { 'district.id': params.districtId } });
    if (params.areaId) {
      filter.push({ nested: { path: 'chambers', query: { term: { 'chambers.areaId': params.areaId } } } });
    }
    if (params.gender) filter.push({ term: { gender: params.gender } });
    if (params.language) filter.push({ term: { languages: params.language } });
    if (params.isAvailableOnline !== undefined) filter.push({ term: { isAvailableOnline: params.isAvailableOnline } });
    if (params.isFeatured !== undefined) filter.push({ term: { isFeatured: params.isFeatured } });
    if (params.minFee !== undefined || params.maxFee !== undefined) {
      filter.push({ range: { consultationFee: { gte: params.minFee, lte: params.maxFee } } });
    }
    if (params.minExperience !== undefined || params.maxExperience !== undefined) {
      filter.push({ range: { experience: { gte: params.minExperience, lte: params.maxExperience } } });
    }

    // Geo filter
    if (lat && lon) {
      filter.push({
        nested: {
          path: 'chambers',
          query: {
            geo_distance: { distance: `${radiusKm}km`, 'chambers.location': { lat, lon } },
          },
        },
      });
    }

    // Sort
    let sort: any[] = [];
    if (query && should.length > 0) {
      sort = [{ _score: { order: 'desc' } }];
    }

    // Always boost sponsored/featured
    const functionScore = {
      query: {
        bool: {
          must: must.length > 0 ? must : [{ match_all: {} }],
          filter,
          should,
          minimum_should_match: should.length > 0 ? 1 : 0,
        },
      },
      functions: [
        { filter: { term: { isFeatured: true } }, weight: 2 },
        { filter: { term: { isVerified: true } }, weight: 1.5 },
        { filter: { exists: { field: 'sponsoredRank' } }, weight: 3 },
        { field_value_factor: { field: 'rating', factor: 0.3, missing: 0, modifier: 'none' } },
        { field_value_factor: { field: 'reviewCount', factor: 0.1, missing: 0, modifier: 'log1p' } },
      ],
      score_mode: 'sum',
      boost_mode: 'multiply',
    };

    const sortQuery = this.buildElasticSort(sortBy, sort);

    const response = await this.esService.search({
      index: this.DOCTORS_INDEX,
      from,
      size: limit,
      body: {
        query: functionScore,
        sort: sortQuery,
        _source: true,
        highlight: query ? {
          fields: {
            name: { number_of_fragments: 0 },
            about: { fragment_size: 150, number_of_fragments: 1 },
            'specialties.name': { number_of_fragments: 0 },
          },
        } : undefined,
      },
    });

    const hits = response.hits.hits;
    const total = typeof response.hits.total === 'number' ? response.hits.total : response.hits.total?.value || 0;

    return {
      data: hits.map((hit: any) => ({ ...hit._source, _score: hit._score, _highlights: hit.highlight })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async autocomplete(query: string) {
    if (!query || query.length < 2) return { suggestions: [] };

    const cacheKey = `autocomplete:${query}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [doctorResponse, hospitalResponse, specialtyResponse] = await Promise.all([
      this.esService.search({
        index: this.DOCTORS_INDEX,
        size: 4,
        body: {
          query: {
            bool: {
              should: [
                { multi_match: { query, fields: ['name.suggest', 'name^2'], type: 'bool_prefix', fuzziness: 'AUTO' } },
                { nested: { path: 'specialties', query: { match_phrase_prefix: { 'specialties.name': query } } } },
              ],
              filter: [{ term: { status: 'ACTIVE' } }],
            },
          },
          _source: ['id', 'name', 'slug', 'photo', 'specialties', 'district'],
        },
      }),
      this.esService.search({
        index: this.HOSPITALS_INDEX,
        size: 3,
        body: {
          query: {
            multi_match: { query, fields: ['name.suggest', 'name^2'], type: 'bool_prefix', fuzziness: 'AUTO' },
          },
          _source: ['id', 'name', 'slug', 'type'],
        },
      }),
      this.prisma.specialty.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        select: { id: true, name: true, nameBn: true, slug: true },
        take: 3,
      }),
    ]);

    const result = {
      suggestions: [
        ...doctorResponse.hits.hits.map((h: any) => ({
          type: 'doctor',
          id: h._source.id,
          name: h._source.name,
          slug: h._source.slug,
          photo: h._source.photo,
          specialty: h._source.specialties?.[0]?.name,
          district: h._source.district?.name,
        })),
        ...hospitalResponse.hits.hits.map((h: any) => ({
          type: 'hospital',
          id: h._source.id,
          name: h._source.name,
          slug: h._source.slug,
          hospitalType: h._source.type,
        })),
        ...specialtyResponse.map((s) => ({
          type: 'specialty',
          id: s.id,
          name: s.name,
          nameBn: s.nameBn,
          slug: s.slug,
        })),
      ],
    };

    await this.redis.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  async getPopularSearches() {
    const cacheKey = 'popular:searches';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const popular = await this.prisma.searchHistory.groupBy({
      by: ['query'],
      _count: { query: true },
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        query: { not: '' },
      },
      orderBy: { _count: { query: 'desc' } },
      take: 10,
    });

    const result = popular.map((p) => ({ query: p.query, count: p._count.query }));
    await this.redis.setex(cacheKey, 3600, JSON.stringify(result));
    return result;
  }

  // Full reindex
  async reindexAll() {
    this.logger.log('Starting full reindex...');

    // Delete and recreate indices
    await this.esService.indices.delete({ index: this.DOCTORS_INDEX }).catch(() => {});
    await this.esService.indices.delete({ index: this.HOSPITALS_INDEX }).catch(() => {});
    await this.createIndices();

    // Reindex doctors in batches
    const batchSize = 100;
    let skip = 0;
    let processed = 0;

    while (true) {
      const doctors = await this.prisma.doctor.findMany({
        where: { status: 'ACTIVE' },
        include: {
          specialties: { include: { specialty: true } },
          qualifications: true,
          chambers: { include: { area: true } },
          hospitals: { include: { hospital: { select: { id: true, name: true, slug: true } } } },
          district: true,
        },
        skip,
        take: batchSize,
      });

      if (doctors.length === 0) break;

      const operations = doctors.flatMap((doc) => [
        { index: { _index: this.DOCTORS_INDEX, _id: doc.id } },
        this.buildDoctorDocument(doc),
      ]);

      await this.esService.bulk({ body: operations });
      processed += doctors.length;
      skip += batchSize;
      this.logger.log(`Indexed ${processed} doctors`);
    }

    // Reindex hospitals
    const hospitals = await this.prisma.hospital.findMany({
      where: { isActive: true },
      include: { district: true },
    });

    for (const hospital of hospitals) {
      await this.indexHospital({ ...hospital, district: hospital.district });
    }

    this.logger.log(`Reindex complete: ${processed} doctors, ${hospitals.length} hospitals`);
    return { doctors: processed, hospitals: hospitals.length };
  }

  private buildDoctorDocument(doctor: any) {
    return {
      id: doctor.id,
      slug: doctor.slug,
      name: doctor.name,
      nameBn: doctor.nameBn,
      title: doctor.title,
      gender: doctor.gender,
      photo: doctor.photo,
      about: doctor.about,
      bmdcNumber: doctor.bmdcNumber,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      rating: doctor.rating,
      reviewCount: doctor.reviewCount,
      totalAppointments: doctor.totalAppointments,
      isVerified: doctor.isVerified,
      isFeatured: doctor.isFeatured,
      isAvailableOnline: doctor.isAvailableOnline,
      sponsoredRank: doctor.sponsoredRank,
      languages: doctor.languages,
      status: doctor.status,
      specialties: (doctor.specialties || []).map((s: any) => ({
        id: s.specialty?.id,
        name: s.specialty?.name,
        nameBn: s.specialty?.nameBn,
        slug: s.specialty?.slug,
        isPrimary: s.isPrimary,
      })),
      qualifications: (doctor.qualifications || []).map((q: any) => ({
        degree: q.degree,
        institution: q.institution,
        year: q.year,
      })),
      chambers: (doctor.chambers || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        areaId: c.areaId,
        areaName: c.area?.name,
        location: c.latitude && c.longitude ? { lat: c.latitude, lon: c.longitude } : undefined,
      })),
      district: doctor.district
        ? { id: doctor.district.id, name: doctor.district.name, nameBn: doctor.district.nameBn, slug: doctor.district.slug }
        : undefined,
      hospitals: (doctor.hospitals || []).map((h: any) => ({
        id: h.hospital?.id,
        name: h.hospital?.name,
        slug: h.hospital?.slug,
      })),
      createdAt: doctor.createdAt,
    };
  }

  private buildElasticSort(sortBy: string, defaultSort: any[]): any[] {
    const sortMap: Record<string, any[]> = {
      relevance: [...defaultSort, { isFeatured: { order: 'desc' } }, { rating: { order: 'desc' } }],
      rating: [{ rating: { order: 'desc' } }, { reviewCount: { order: 'desc' } }],
      experience: [{ experience: { order: 'desc' } }],
      fee_low: [{ consultationFee: { order: 'asc' } }],
      fee_high: [{ consultationFee: { order: 'desc' } }],
      popular: [{ totalAppointments: { order: 'desc' } }],
      newest: [{ createdAt: { order: 'desc' } }],
    };
    return sortMap[sortBy] || sortMap.relevance;
  }
}
