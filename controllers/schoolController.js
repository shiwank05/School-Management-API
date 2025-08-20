const { pool } = require('../config/database');
const { addSchoolSchema, listSchoolsSchema } = require('../utils/validation');
const { calculateDistance } = require('../utils/distance');

class SchoolController {
  // Add new school
  async addSchool(req, res) {
    try {
      // Validate request body
      const { error, value } = addSchoolSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      const { name, address, latitude, longitude } = value;

      // Check if school with same name and address already exists
      const [existingSchools] = await pool.execute(
        'SELECT id FROM schools WHERE name = ? AND address = ?',
        [name, address]
      );

      if (existingSchools.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'School with this name and address already exists'
        });
      }

      // Insert new school
      const [result] = await pool.execute(
        'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
        [name, address, latitude, longitude]
      );

      res.status(201).json({
        success: true,
        message: 'School added successfully',
        data: {
          id: result.insertId,
          name,
          address,
          latitude,
          longitude
        }
      });
    } catch (error) {
      console.error('Error adding school:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // List schools sorted by proximity
  async listSchools(req, res) {
    try {
      // Validate query parameters
      const queryData = {
        latitude: parseFloat(req.query.latitude),
        longitude: parseFloat(req.query.longitude)
      };

      const { error, value } = listSchoolsSchema.validate(queryData);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      const { latitude: userLat, longitude: userLon } = value;

      // Fetch all schools from database
      const [schools] = await pool.execute(
        'SELECT id, name, address, latitude, longitude FROM schools'
      );

      if (schools.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No schools found',
          data: []
        });
      }

      // Calculate distance for each school and sort by proximity
      const schoolsWithDistance = schools.map(school => {
        const distance = calculateDistance(
          userLat, userLon, 
          school.latitude, school.longitude
        );
        return {
          ...school,
          distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
        };
      });

      // Sort by distance (closest first)
      schoolsWithDistance.sort((a, b) => a.distance - b.distance);

      res.status(200).json({
        success: true,
        message: 'Schools retrieved successfully',
        data: schoolsWithDistance,
        userLocation: {
          latitude: userLat,
          longitude: userLon
        }
      });
    } catch (error) {
      console.error('Error listing schools:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new SchoolController();
