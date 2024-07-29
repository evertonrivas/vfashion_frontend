export const environment = {
    backend_b2b: "https://fast2bee.pythonanywhere.com/b2b/api",
    backend_fpr: "https://fast2bee.pythonanywhere.com/fpr/api",
    backend_crm: "https://fast2bee.pythonanywhere.com/crm/api",
    backend_scm: "https://fast2bee.pythonanywhere.com/scm/api",
    backend_cmm: "https://fast2bee.pythonanywhere.com/cmm/api",    
    company:{
        name: "Company Name",
        logo_home: "logo-venda-fashion.png",
        logo_mini: "logo-venda-fashion-mini.png",
        instagram: "https://instagram.com/company_page",
        facebook: "https://facebook.com/company_page",
        linkedin: "https://linkedin.com/in/company_page"
    },
    system:{
        pageSize: 25,
        max_upload_files: 7,
        max_upload_images: 4,
        use_url_images:true
    },
    locale: {
        language: "pt",
        currency_code: "R$",
        date_format: "shortDate",
        timezone: "-0300"
    },
    recaptcha: {
        siteKey : "6Le7VGUlAAAAAMUwZDKXC-lhfBV9l_dHEMvxCVdV"
    },
    version: '1.0.0'
};
