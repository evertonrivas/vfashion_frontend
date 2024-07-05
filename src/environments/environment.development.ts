export const environment = {
    backend_b2b: "http://192.168.3.8:5000/b2b/api",
    backend_fpr: "http://192.168.3.8:5000/fpr/api",
    backend_crm: "http://192.168.3.8:5000/crm/api",
    backend_scm: "http://192.168.3.8:5000/scm/api",
    backend_cmm: "http://192.168.3.8:5000/cmm/api",    
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
