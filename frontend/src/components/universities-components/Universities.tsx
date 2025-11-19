"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, CardBody, Spinner, Chip } from '@heroui/react';
import { Plus, Search, Trash2 } from 'lucide-react';

interface Country {
  id: string;
  name: string;
  flag?: string;
  _count?: { universities: number };
}

interface University {
  id: string;
  name: string;
  logo?: string;
  city?: string;
  countryId: string;
  country?: Country;
  _count?: { courses: number };
}

interface Course {
  id: string;
  name: string;
  description?: string;
  level?: string;
  category?: string;
  duration?: number;
  feeType?: string;
  originalFee?: number;
  fee?: number;
  applicationFee?: number;
  intakeMonth?: string;
  commission?: string;
  universityId: string;
  university?: University;
}

export default function Universities() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { isOpen: isCountryOpen, onOpen: onCountryOpen, onClose: onCountryClose } = useDisclosure();
  const { isOpen: isUniversityOpen, onOpen: onUniversityOpen, onClose: onUniversityClose } = useDisclosure();
  const { isOpen: isCourseOpen, onOpen: onCourseOpen, onClose: onCourseClose } = useDisclosure();

  const [countryForm, setCountryForm] = useState({ name: '', flag: '' });
  const [universityForm, setUniversityForm] = useState({ name: '', logo: '', city: '' });
  const [courseForm, setCourseForm] = useState({
    name: '', description: '', level: '', category: '', duration: 0,
    feeType: '', originalFee: 0, fee: 0, applicationFee: 0,
    intakeMonth: '', commission: ''
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchUniversities(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedUniversity) {
      fetchCourses(selectedUniversity.id);
    }
  }, [selectedUniversity]);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const data = await api.CountriesAPI.getAll();
      setCountries(data);
      if (data.length > 0 && !selectedCountry) {
        setSelectedCountry(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async (countryId: string) => {
    setLoading(true);
    try {
      const data = await api.UniversitiesAPI.getAll(countryId);
      setUniversities(data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (universityId: string) => {
    setLoading(true);
    try {
      const data = await api.CoursesAPI.getAll({ universityId });
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCountry = async () => {
    try {
      await api.CountriesAPI.create(countryForm);
      setCountryForm({ name: '', flag: '' });
      onCountryClose();
      fetchCountries();
    } catch (error) {
      console.error('Error creating country:', error);
    }
  };

  const handleAddUniversity = async () => {
    if (!selectedCountry) return;
    try {
      await api.UniversitiesAPI.create({
        ...universityForm,
        countryId: selectedCountry,
      });
      setUniversityForm({ name: '', logo: '', city: '' });
      onUniversityClose();
      fetchUniversities(selectedCountry);
    } catch (error) {
      console.error('Error creating university:', error);
    }
  };

  const handleAddCourse = async () => {
    if (!selectedUniversity) return;
    try {
      await api.CoursesAPI.create({
        ...courseForm,
        universityId: selectedUniversity.id,
      });
      setCourseForm({
        name: '', description: '', level: '', category: '', duration: 0,
        feeType: '', originalFee: 0, fee: 0, applicationFee: 0,
        intakeMonth: '', commission: ''
      });
      onCourseClose();
      fetchCourses(selectedUniversity.id);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">Universities</h1>
      <p className="text-gray-600 text-sm mb-4">
        Manage countries, universities, and courses here.
      </p>

      <div className="w-full flex h-[calc(100vh-200px)] border rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Countries Sidebar */}
        <div className="w-1/5 border-r overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Countries</h3>
              <Button
                size="sm"
                color="primary"
                variant="light"
                startContent={<Plus className="h-4 w-4" />}
                onPress={onCountryOpen}
              >
                Add
              </Button>
            </div>
          </div>
          
          <div className="p-2">
            {loading && !countries.length ? (
              <div className="flex justify-center p-4">
                <Spinner size="sm" />
              </div>
            ) : (
              countries.map((country) => (
                <div
                  key={country.id}
                  onClick={() => setSelectedCountry(country.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                    selectedCountry === country.id ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  {country.flag && (
                    <span className="text-2xl">{country.flag}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{country.name}</p>
                    <p className="text-xs text-gray-500">
                      {country._count?.universities || 0} universities
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Universities List */}
        <div className="flex-1 flex flex-col">
          <div className="sticky top-0 bg-white z-10 p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Universities</h3>
              <Button
                size="sm"
                color="primary"
                startContent={<Plus className="h-4 w-4" />}
                onPress={onUniversityOpen}
                isDisabled={!selectedCountry}
              >
                Add University
              </Button>
            </div>
            <Input
              placeholder="Search Universities"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="h-4 w-4 text-gray-400" />}
              size="sm"
              classNames={{
                input: "text-sm",
                inputWrapper: "h-9"
              }}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading && !universities.length ? (
              <div className="flex justify-center p-8">
                <Spinner />
              </div>
            ) : filteredUniversities.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No universities found
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUniversities.map((uni) => (
                  <Card
                    key={uni.id}
                    isPressable
                    onPress={() => setSelectedUniversity(uni)}
                    className={`${
                      selectedUniversity?.id === uni.id ? 'border-2 border-blue-500' : ''
                    }`}
                  >
                    <CardBody className="p-4">
                      <div className="flex items-start gap-3">
                        {uni.logo && (
                          <img
                            src={uni.logo}
                            alt={uni.name}
                            className="w-12 h-12 object-contain rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{uni.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {uni._count?.courses || 0} courses
                            {uni.city && ` • ${uni.city}`}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          onPress={() => {
                            setSelectedUniversity(uni);
                            onCourseOpen();
                          }}
                        >
                          Add Courses
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Courses Panel */}
        {selectedUniversity && (
          <div className="w-2/5 border-l flex flex-col">
            <div className="sticky top-0 bg-white z-10 p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">
                    {selectedUniversity.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {courses.length} courses available
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center p-8">
                  <Spinner />
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No courses added yet
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.map((course) => (
                    <Card key={course.id} className="shadow-sm">
                      <CardBody className="p-3">
                        <h5 className="font-medium text-sm mb-2">{course.name}</h5>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {course.level && (
                            <Chip size="sm" variant="flat" color="primary">
                              {course.level}
                            </Chip>
                          )}
                          {course.category && (
                            <Chip size="sm" variant="flat" color="secondary">
                              {course.category}
                            </Chip>
                          )}
                        </div>
                        {course.description && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {course.description}
                          </p>
                        )}
                        <div className="text-xs text-gray-500 space-y-1">
                          {course.fee && (
                            <div>Fee: ${course.fee}</div>
                          )}
                          {course.intakeMonth && (
                            <div>Intake: {course.intakeMonth}</div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Country Modal */}
      <Modal isOpen={isCountryOpen} onClose={onCountryClose}>
        <ModalContent>
          <ModalHeader>Add Country</ModalHeader>
          <ModalBody>
            <Input
              label="Country Name"
              value={countryForm.name}
              onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })}
              isRequired
            />
            <Input
              label="Flag Emoji (Optional)"
              value={countryForm.flag}
              onChange={(e) => setCountryForm({ ...countryForm, flag: e.target.value })}
              placeholder="🇦🇺"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCountryClose}>Cancel</Button>
            <Button color="primary" onPress={handleAddCountry}>Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add University Modal */}
      <Modal isOpen={isUniversityOpen} onClose={onUniversityClose}>
        <ModalContent>
          <ModalHeader>Add University</ModalHeader>
          <ModalBody>
            <Input
              label="University Name"
              value={universityForm.name}
              onChange={(e) => setUniversityForm({ ...universityForm, name: e.target.value })}
              isRequired
            />
            <Input
              label="City (Optional)"
              value={universityForm.city}
              onChange={(e) => setUniversityForm({ ...universityForm, city: e.target.value })}
            />
            <Input
              label="Logo URL (Optional)"
              value={universityForm.logo}
              onChange={(e) => setUniversityForm({ ...universityForm, logo: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onUniversityClose}>Cancel</Button>
            <Button color="primary" onPress={handleAddUniversity}>Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Course Modal */}
      <Modal isOpen={isCourseOpen} onClose={onCourseClose} size="2xl">
        <ModalContent>
          <ModalHeader>Add Course</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Course Name"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                isRequired
                className="col-span-2"
              />
              <Input
                label="Level"
                placeholder="e.g., Masters, Bachelors"
                value={courseForm.level}
                onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
              />
              <Input
                label="Category"
                placeholder="e.g., IT, Business"
                value={courseForm.category}
                onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
              />
              <Input
                label="Duration (months)"
                type="number"
                value={courseForm.duration.toString()}
                onChange={(e) => setCourseForm({ ...courseForm, duration: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Fee"
                type="number"
                value={courseForm.fee.toString()}
                onChange={(e) => setCourseForm({ ...courseForm, fee: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Application Fee"
                type="number"
                value={courseForm.applicationFee.toString()}
                onChange={(e) => setCourseForm({ ...courseForm, applicationFee: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Intake Months"
                placeholder="e.g., Sep, Jan"
                value={courseForm.intakeMonth}
                onChange={(e) => setCourseForm({ ...courseForm, intakeMonth: e.target.value })}
              />
              <Input
                label="Commission"
                placeholder="e.g., 1000 USD or 10%"
                value={courseForm.commission}
                onChange={(e) => setCourseForm({ ...courseForm, commission: e.target.value })}
                className="col-span-2"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCourseClose}>Cancel</Button>
            <Button color="primary" onPress={handleAddCourse}>Add Course</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
