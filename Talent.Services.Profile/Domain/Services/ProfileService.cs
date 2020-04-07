using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }


        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            User profile = (await _userRepository.GetByIdAsync(Id));

            if (profile != null)
            {
                var videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);
                var cvUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.CvName, FileType.UserCV);

                var languages = profile.Languages.Select(x => ViewModeFromLanguage(x)).ToList();
                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();
                var education = profile.Education.Select(x => ViewModelFromEducation(x)).ToList();
                var certifications = profile.Certifications.Select(x => ViewModelFromCertification(x)).ToList();
                var experience = profile.Experience.Select(x => ViewModelFromExperience(x)).ToList();

                var result = new TalentProfileViewModel
                {
                    Id = profile.Id,
                    FirstName = profile.FirstName,
                    MiddleName = profile.MiddleName,
                    LastName = profile.LastName,
                    Gender = profile.Gender,

                    Email = profile.Email,

                    Phone = profile.Phone,
                    MobilePhone = profile.MobilePhone,
                    IsMobilePhoneVerified = profile.IsMobilePhoneVerified,

                    Address = profile.Address,
                    Nationality = profile.Nationality,
                    VisaStatus = profile.VisaStatus,
                    VisaExpiryDate = profile.VisaExpiryDate,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,

                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    CvName = profile.CvName,
                    CvUrl = cvUrl,
                    Summary = profile.Summary,
                    Description = profile.Description,
                    LinkedAccounts = profile.LinkedAccounts,
                    JobSeekingStatus = profile.JobSeekingStatus,

                    Languages = languages,
                    Skills = skills,
                    Education = education,
                    Certifications = certifications,
                    Experience = experience
                };
                return result;
            }
            return null;
        }

        public async Task<string> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            try
            {
                string message = "";
                User user = (await _userRepository.GetByIdAsync(model.Id));

                user.LinkedAccounts = model.LinkedAccounts;

                user.FirstName = model.FirstName;
                user.MiddleName = model.MiddleName;
                user.LastName = model.LastName;
                user.Gender = model.Gender;

                user.Email = model.Email;
                user.Phone = model.Phone;
                user.MobilePhone = model.MobilePhone;
                user.IsMobilePhoneVerified = model.IsMobilePhoneVerified;

                user.Address = model.Address;

                user.Nationality = model.Nationality;

                message = UpdateTalentLanguagesFromView(user, model);
                if (!String.IsNullOrWhiteSpace(message)) return message;

                message = UpdateTalentSkillsFromView(user, model);
                if (!String.IsNullOrWhiteSpace(message)) return message;

                message = UpdateTalentExperiencesFromView(user, model);
                if (!String.IsNullOrWhiteSpace(message)) return message;

                user.VisaStatus = model.VisaStatus;
                user.VisaExpiryDate = model.VisaExpiryDate;

                user.JobSeekingStatus = model.JobSeekingStatus;

                user.ProfilePhoto = model.ProfilePhoto;
                user.ProfilePhotoUrl = model.ProfilePhotoUrl;

                user.Summary = model.Summary;
                user.Description = model.Description;

                user.UpdatedOn = DateTime.Now;
                user.UpdatedBy = updaterId;

                await _userRepository.Update(user);

                return message;
            }
            catch (MongoException e)
            {
                return e.Message;
            }
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<string> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return "Unsupport file type: "+ fileExtension;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return "Can't find talent: " + talentId;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return null;
            }

            return "Save phote error";
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            if (position >= _userRepository.Collection.Count()) return null;
            var talentList = _userRepository.Collection.Skip(position).Take(increment).AsEnumerable();
            var result = new List<TalentSnapshotViewModel>();
            var videoUrl = "";
            var cvUrl = "";
            UserExperience experience;
            TalentSnapshotCurrentEmploymentViewModel employmentViewModel = null;

            foreach (var item in talentList)
            {
                videoUrl = string.IsNullOrWhiteSpace(item.VideoName)
                    ? ""
                    : await _fileService.GetFileURL(item.VideoName, FileType.UserVideo);
                cvUrl = string.IsNullOrWhiteSpace(item.CvName)
                    ? ""
                    : await _fileService.GetFileURL(item.CvName, FileType.UserCV);
                experience = null;
                // Find the lastest job
                foreach (var exp in item.Experience)
                {
                    if (experience == null)
                    {
                        experience = exp;
                    }
                    else {
                        if (experience.End < exp.End)
                        {
                            experience = exp;
                        }
                    }
                }
                if (experience != null)
                {
                    employmentViewModel = new TalentSnapshotCurrentEmploymentViewModel
                    {
                        Company = experience.Company,
                        Position = experience.Position
                    };
                }

                var newItem = new TalentSnapshotViewModel
                {
                    Id = item.Id,
                    Name = item.FirstName + " " + item.LastName,
                    PhotoId = item.ProfilePhotoUrl,
                    VideoUrl = videoUrl,
                    CVUrl = cvUrl,
                    Summary = item.Summary,
                    CurrentEmployment = employmentViewModel,
                    Visa = item.VisaStatus,
                    Level = "",
                    Skills = item.Skills.Select(x => x.Skill).ToList(),
                    LinkedAccounts = item.LinkedAccounts
                };
                result.Add(newItem);
            }
            return result;
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods
        #region Update from View
        protected string UpdateTalentLanguagesFromView(User user, TalentProfileViewModel model)
        {
            var newLanguages = new List<UserLanguage>();
            IDictionary<string, bool> languageNames = new Dictionary<string, bool>();
            foreach (var item in model.Languages)
            {
                if (String.IsNullOrWhiteSpace(item.Name)) return "Please enter language name.";
                if (String.IsNullOrWhiteSpace(item.Level)) return "Please select language level.";
                if (languageNames.ContainsKey(item.Name)) return "Can't save a language which you already have.";

                var language = user.Languages.SingleOrDefault(x => x.Id == item.Id);
                if (language == null) language = new UserLanguage { Id = ObjectId.GenerateNewId().ToString() };
                language.UserId = user.Id;
                language.IsDeleted = false;
                language.Language = item.Name;
                language.LanguageLevel = item.Level;
                newLanguages.Add(language);

                languageNames.Add(language.Language, true);
            }
            user.Languages = newLanguages;
            return null;
        }

        protected string UpdateTalentSkillsFromView(User user, TalentProfileViewModel model)
        {
            var newSkills = new List<UserSkill>();
            IDictionary<string, bool> skillNames = new Dictionary<string, bool>();
            foreach (var item in model.Skills)
            {
                if (String.IsNullOrWhiteSpace(item.Name)) return "Please enter skill name.";
                if (String.IsNullOrWhiteSpace(item.Level)) return "Please select skill level.";
                if (skillNames.ContainsKey(item.Name)) return "Can't save a skill which you already have.";

                var skill = user.Skills.SingleOrDefault(x => x.Id == item.Id);
                if (skill == null) skill = new UserSkill { Id = ObjectId.GenerateNewId().ToString() };
                skill.UserId = user.Id;
                skill.IsDeleted = false;
                skill.ExperienceLevel = item.Level;
                skill.Skill = item.Name;
                newSkills.Add(skill);

                skillNames.Add(skill.Skill, true);
            }

            user.Skills = newSkills;
            return null;
        }

        protected string UpdateTalentExperiencesFromView(User user, TalentProfileViewModel model)
        {
            var newExperiences = new List<UserExperience>();
            foreach (var item in model.Experience)
            {
                var experience = user.Experience.SingleOrDefault(x => x.Id == item.Id);
                if (experience == null) experience = new UserExperience { Id = ObjectId.GenerateNewId().ToString() };
                experience.UserId = user.Id;
                experience.IsDeleted = false;
                experience.Company = item.Company;
                experience.Position = item.Position;
                experience.Responsibilities = item.Responsibilities;
                experience.Start = item.Start;
                experience.End = item.End;
                newExperiences.Add(experience);
            }
            user.Experience = newExperiences;
            return null;
        }

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        #endregion

        #region Build Views from Model
        protected AddLanguageViewModel ViewModeFromLanguage(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Name = language.Language,
                Id = language.Id,
                Level = language.LanguageLevel,
                CurrentUserId = language.UserId
            };
        }

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected AddEducationViewModel ViewModelFromEducation(UserEducation education)
        {
            return new AddEducationViewModel
            {
                Country = education.Country,
                InstituteName = education.InstituteName,
                Title = education.Title,
                Degree = education.Degree,
                YearOfGraduation = education.YearOfGraduation,
                Id = education.Id
            };
        }

        protected AddCertificationViewModel ViewModelFromCertification(UserCertification certification)
        {
            return new AddCertificationViewModel
            {
                Id = certification.Id,
                CertificationName = certification.CertificationName,
                CertificationFrom = certification.CertificationFrom,
                CertificationYear = certification.CertificationYear
            };
        }

        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            throw new NotImplementedException();
        }
        #endregion

    }
}
